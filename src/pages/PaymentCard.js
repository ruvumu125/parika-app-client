import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "./PaymentCardCss.css";

function PaymentCard() {
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const vehiculeData = JSON.parse(params.get('vehiculeData'));

    if (!vehiculeData || Object.keys(vehiculeData).length === 0) {
        navigate('/vehicules');
        return null;
    } else {
        console.log('vehiculeData is not empty');
    }

    // Function to capture HTML and generate PDF
    const handleGeneratePDF = () => {
        const input = document.getElementById('payment-card'); // Get the element by ID
        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new PDF document

            // Add image to PDF
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 299; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add more pages if content overflows
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('payment_card.pdf'); // Save the generated PDF
        });
    };

    return (
        <div className="umushishuro" >
            <div className="vehicle-card" id="payment-card">
                <div className="vehicle-header">
                    <h2>{vehiculeData.registrationNumber}</h2>
                </div>
                <div className="vehicle-content">
                    <div className="vehicle-info">
                        <h5>Plate number   : <span>{vehiculeData.registrationNumber}</span></h5>
                        <h5>Vehicule type  : <span>{vehiculeData.vehicleType.vehiculeTypeName}</span></h5>
                        <h5>Account number : <span>{vehiculeData.accountNumber}</span></h5>
                    </div>
                    <hr className="separator"/>
                    <div className="qr-code">
                        <img src={`data:image/png;base64,${vehiculeData.qrCodeImage}`} alt="QR Code"/>
                    </div>
                </div>
                <div className="vehicle-footer">
                    <p>Powered by Company Name</p>
                </div>
            </div>

            <button onClick={handleGeneratePDF} className="print-button">Generate PDF</button>
        </div>
    );
}

export default PaymentCard;
