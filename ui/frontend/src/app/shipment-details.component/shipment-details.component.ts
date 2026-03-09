import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ShipmentService } from '../services/shipment.service';
import { GenericTableComponent, TableColumn } from '../shareable/components/generic-table.component/generic-table.component';
import { StatCardComponent } from '../shareable/components/stat-card.component/stat-card.component';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-shipment-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableComponent, FormsModule, StatCardComponent],
  templateUrl: './shipment-details.component.html',
  styleUrl: './shipment-details.component.scss'
})
export class ShipmentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private shipmentService = inject(ShipmentService);

  // State Signals
  showStatusModal = signal(false);
  selectedStatus = signal('');
  isLoading = signal(true);
  
  // Data Signals
  shipment = signal<any>(null);
  routes = signal<any>(null);

  // Auth/Role Logic
  rolePath = computed(() => 
    this.authService.currentUser()?.role?.toLowerCase() === 'admin' ? 'admin' : 'operator'
  );

  // Table Configuration
  routeCols = signal<TableColumn[]>([
    { field: 'stopName', header: 'Location' },
    { field: 'type', header: 'Type' },
    { field: 'status', header: 'Status', type: 'badge' }
  ]);

  // Logic to transform the "Mumbai, Pune..." string into Table Data
  routeData = computed(() => {
    const routeResponse = this.routes();
    if (!routeResponse || !routeResponse.stops) return [];

    // Split string into array: ["Mumbai", "Pune", "Satara", "Kolhapur"]
    const stopNames = routeResponse.stops.split(',').map((s: string) => s.trim());

    return stopNames.map((stop: string, index: number) => {
      let type = 'Stopover';
      if (index === 0) type = 'Origin (Pickup)';
      if (index === stopNames.length - 1) type = 'Destination (Dropoff)';

      return {
        stopName: stop,
        type: type,
        status: index === 0 ? 'Completed' : 'Pending' // Simple logic for demonstration
      };
    });
  });

  // Financial Calculations
  totalOperatingCost = computed(() => {
    const s = this.shipment();
    if (!s) return 0;
    return (s.fuelCost || 0) + (s.laborCost || 0) + (s.tollCost || 0);
  });

  netProfit = computed(() => {
    const s = this.shipment();
    if (!s) return 0;
    return (s.revenue || 0) - this.totalOperatingCost();
  });

  statusOptions = [
    { label: 'Created', value: 'CREATED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadShipmentData(id);
    }
  }

  loadShipmentData(id: string) {
    this.isLoading.set(true);
    this.shipmentService.getShipmentById(id).subscribe({
      next: (data) => {
        this.shipment.set(data);
        // Once shipment is loaded, fetch the associated route data
        if (data.routeId) {
          this.loadRouteData(data.routeId);
        } else {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching shipment:', err);
        this.isLoading.set(false);
      }
    });
  }
  
  loadRouteData(routeId: string) {
    this.shipmentService.getRouteById(routeId).subscribe({
      next: (data) => {
        this.routes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching routes:', err);
        this.isLoading.set(false);
      }
    });
  }

  openStatusModal() {
    if (this.shipment()) {
      this.selectedStatus.set(this.shipment().status);
      this.showStatusModal.set(true);
    }
  }

confirmStatusUpdate() {
  const newStatus = this.selectedStatus();
  const shipmentId = this.shipment().id;

  if (!shipmentId) return;

  // 1. Call the service (API endpoint)
  this.shipmentService.updateStatus(shipmentId, newStatus).subscribe({
    next: (response) => {
      // 2. Update local state only after successful DB update
      this.shipment.update(s => ({ ...s, status: newStatus }));
      
      // 3. Close the modal
      this.showStatusModal.set(false);
      
      console.log('Status updated successfully in DB');
    },
    error: (err) => {
      console.error('Failed to update status:', err);
      // Optional: Add a toast message or alert to tell the user it failed
      alert('Could not update status. Please try again.');
    }
  });
}
  getStatusClass(status: string): string {
    if (!status) return 'pending';
    return status.toLowerCase();
  }
  downloadManifest() {
  const s = this.shipment();
  const r = this.routes();
  const doc = new jsPDF();

  // 1. Header / Branding
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Primary Blue
  doc.text("TRANSLINK", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Shipment ID: ${s?.shipmentNumber}`, 14, 35);

  // 2. Client & Logistics Info (Invoice Style)
  autoTable(doc, {
    startY: 45,
    head: [['Customer Details', 'Shipment Information']],
    body: [[
      `Name: ${s?.clientName}\nPhone: ${s?.clientNumber}\nStatus: ${s?.status}`,
      `Vehicle ID: ${r?.vehicleID || 'N/A'}\nWeight: ${s?.totalWeight} kg\nRevenue: $${s?.revenue}`
    ]],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // 3. Financial Summary
  const finalY = (doc as any).lastAutoTable.finalY || 60;
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Financial Summary', 14, finalY + 10);
  
  autoTable(doc, {
    startY: finalY + 15,
    head: [['Description', 'Amount']],
    body: [
      ['Total Bill', `$${s?.revenue?.toFixed(2)}`]
    ],
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
  });

  // 4. Route Details Table
  const routeY = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Route Progress & Stops', 14, routeY);

  const tableRows = this.routeData().map((stop: { stopName: any; type: any; status: any; }) => [
    stop.stopName,
    stop.type,
    stop.status
  ]);

  autoTable(doc, {
    startY: routeY + 5,
    head: [['Location', 'Stop Type', 'Status']],
    body: tableRows,
    headStyles: { fillColor: [59, 130, 246] }, // Blue Header
  });

  // 5. Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} - Authorized Manifest Document`, 14, doc.internal.pageSize.getHeight() - 10);
  }

  // Save the PDF
  doc.save(`Manifest_${s?.shipmentNumber}.pdf`);
}
}