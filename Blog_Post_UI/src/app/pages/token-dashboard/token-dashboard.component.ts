import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UserAuthenticateState } from '../../store/user-authentication/user-authentication.state';
import { BkashPaymentComponent } from '../bkash-payment/bkash-payment.component';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-token-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BkashPaymentComponent],
  templateUrl: './token-dashboard.component.html',
})
export class TokenDashboardComponent implements OnInit {
  student = {
    id: '',
    name: ''
  };

  selectedMeal = 'Lunch';
  mealDate = new Date().toISOString().substring(0, 10);
  quantity = 1;

  halls = [
    'Shahid Ziaur Rahman Hall',
    'Jananeta Abdul Mannan Hall',
    'Bangabandhu Sheikh Mujibur Rahman Hall',
    'Alema Khatun Bhashani Hall',
    'Jahanara Imam Hall',
    'Sheikh Russel Hall',
    'Bangamata Sheikh Fojilatunnesa Mujib Hall'
  ];
  selectedHall = this.halls[0];

  tokens: any[] = [];
  showPaymentModal = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    const userData = this.store.selectSnapshot(UserAuthenticateState.getUserData);
    if (userData) {
      this.student.id = userData.email;
      this.student.name = `${userData.firstName} ${userData.lastName}`;
    }
  }

  openPaymentModal() {
    this.showPaymentModal = true;
  }

  handleBkashConfirm(event: { bkashNumber: string; trxId: string }) {
    const token = {
      hall: this.selectedHall,
      meal: this.selectedMeal,
      date: this.mealDate,
      quantity: this.quantity,
      price: this.quantity * 30,
      studentName: this.student.name,
      studentId: this.student.id,
      bkashNumber: event.bkashNumber,
      trxId: event.trxId
    };

    this.tokens.push(token);
    this.showPaymentModal = false;
    alert('✅ Payment successful and token purchased!');
  }

  cancelPayment() {
    this.showPaymentModal = false;
  }

  downloadTokenAsPdf(token: any, index: number) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('🍱 MBSTU Meal Token', 20, 20);

    doc.setFontSize(12);
    doc.text(`Token #${index + 1}`, 20, 35);
    doc.text(`Student Name: ${token.studentName}`, 20, 45);
    doc.text(`Student ID: ${token.studentId}`, 20, 55);
    doc.text(`Hall: ${token.hall}`, 20, 65);
    doc.text(`Meal: ${token.meal}`, 20, 75);
    doc.text(`Date: ${token.date}`, 20, 85);
    doc.text(`Quantity: ${token.quantity}`, 20, 95);
    doc.text(`Price: ৳${token.price}`, 20, 105);
    doc.text(`bKash Number: ${token.bkashNumber}`, 20, 115);
    doc.text(`Trx ID: ${token.trxId}`, 20, 125);

    doc.save(`token_${index + 1}.pdf`);
  }
}
