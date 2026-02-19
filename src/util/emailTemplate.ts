const imagePath = "./public/assets/logo.png";

interface PlanDetails {
  userName: string;
  planName: string;
  amountPaid: string; // Formatted as currency
  transactionId: string;
  dashboardUrl: string;
  frontendUrl: string;
}

export const planBuy = (details: PlanDetails): string => {
  const {
    userName,
    planName,
    amountPaid,
    transactionId,
    dashboardUrl,
    frontendUrl,
  } = details;
  //   let html = `
  // // <!DOCTYPE html>
  // // <html lang="en">
  // //   <head>
  // //     <meta charset="UTF-8" />
  // //     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  // //     <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  // //     <title>Plan Buy</title>

  // //     <!-- Fonts & Icons -->
  // //     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
  // //     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  // //     <style>
  // //       body {
  // //         font-family: 'Poppins', sans-serif;
  // //         background: #f7fafc;
  // //         margin: 0;
  // //         padding: 0;
  // //         color: #1a202c;
  // //       }

  // //       .container {
  // //         padding: 24px;
  // //       }

  // //       .card {
  // //         max-width: 960px;
  // //         margin: auto;
  // //         background: white;
  // //         box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  // //         border-radius: 12px;
  // //         overflow: hidden;
  // //       }

  // //       .header {
  // //         text-align: center;
  // //         background: linear-gradient(to bottom, #ffe4e4, #ffffff);
  // //         padding: 32px 16px;
  // //       }

  // //       .logo {
  // //         width: 120px;
  // //         height: auto;
  // //         object-fit: contain;
  // //         margin-bottom: 12px;
  // //       }

  // //       .inner_section {
  // //         padding: 0 3rem 2rem;
  // //       }

  // //       .banner_section {
  // //         position: relative;
  // //         margin-bottom: 2rem;
  // //       }

  // //       .banner {
  // //         width: 100%;
  // //         height: 300px;
  // //         border-radius: 10px;
  // //         object-fit: cover;
  // //       }

  // //       .banner_heading {
  // //         position: absolute;
  // //         top: 0; left: 0; right: 0; bottom: 0;
  // //         display: flex;
  // //         align-items: center;
  // //         justify-content: center;
  // //         font-size: 32px;
  // //         font-weight: 600;
  // //         color: white;
  // //         text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  // //         text-align: center;
  // //         padding: 0 1rem;
  // //       }

  // //       .title {
  // //         font-size: 28px;
  // //         font-weight: 600;
  // //         margin-top: 1.5rem;
  // //         margin-bottom: 1rem;
  // //       }

  // //       .highlight {
  // //         color: #e53e3e;
  // //       }

  // //       .description {
  // //         font-size: 18px;
  // //         line-height: 1.6;
  // //         margin-bottom: 2rem;
  // //       }

  // //       .table {
  // //         width: 100%;
  // //         border-collapse: collapse;
  // //         margin-bottom: 2rem;
  // //       }

  // //       th, td {
  // //         padding: 14px 18px;
  // //         border-bottom: 1px solid #ccc;
  // //         font-size: 16px;
  // //         text-align: left;
  // //       }

  // //       thead {
  // //         background: #f2f2f2;
  // //       }

  // //       .steps {
  // //         padding-left: 1.5rem;
  // //         font-size: 18px;
  // //         line-height: 1.8;
  // //         margin-bottom: 2rem;
  // //       }

  // //       .cta {
  // //         text-align: center;
  // //         margin: 2.5rem 0;
  // //       }

  // //       .dashboard-btn {
  // //         background: #e53e3e;
  // //         color: white;
  // //         padding: 14px 30px;
  // //         border-radius: 30px;
  // //         font-size: 16px;
  // //         font-weight: 600;
  // //         text-decoration: none;
  // //       }

  // //       .footer {
  // //         background: linear-gradient(to top, #ffe4e4, #ffffff);
  // //         padding: 2rem 3rem;
  // //         border-top: 1px solid #f5c2c2;
  // //         text-align: center;
  // //       }

  // //       .social-links {
  // //         display: flex;
  // //         justify-content: center;
  // //         gap: 20px;
  // //         margin-bottom: 16px;
  // //       }

  // //       .social-links img {
  // //         width: 32px;
  // //         height: 32px;
  // //         object-fit: contain;
  // //         transition: transform 0.3s;
  // //       }

  // //       .social-links img:hover {
  // //         transform: scale(1.1);
  // //       }

  // //       .footer-links {
  // //         margin: 1rem 0;
  // //         display: flex;
  // //         flex-wrap: wrap;
  // //         justify-content: center;
  // //         gap: 1.5rem;
  // //       }

  // //       .footer-links a {
  // //         text-decoration: none;
  // //         font-size: 16px;
  // //         color: #1b1d20;
  // //       }

  // //       .footer-text {
  // //         font-size: 14px;
  // //         color: #444;
  // //         margin-top: 1rem;
  // //       }

  // //       .footer-text a {
  // //         color: #3554c1;
  // //         text-decoration: underline;
  // //       }
  // //     </style>
  // //   </head>

  // //   <body>
  // //     <div class="container">
  // //       <div class="card">
  // //         <div class="header">
  // //           <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Logo" class="logo" />
  // //         </div>

  // //         <div class="inner_section">
  // //           <div class="banner_section">

  // //             <div class="banner_heading">
  // //               Your Marriage Registration Plan is Confirmed
  // //             </div>
  // //           </div>

  // //           <p class="title">
  // //             Marriage Registration <span class="highlight">under Premium Plan</span>
  // //           </p>

  // //           <p class="description">
  // //             Thank you for choosing the plan. Your plan has been successfully activated, and we’re excited to assist you in completing your marriage registration process.
  // //           </p>

  // //           <p class="title">Plan <span class="highlight">Details</span></p>

  // //           <table class="table">
  // //             <thead>
  // //               <tr>
  // //                 <th>Plan Name</th>
  // //                 <th>Total Amount Paid</th>
  // //                 <th>Service Type</th>
  // //                 <th>Transaction ID</th>
  // //               </tr>
  // //             </thead>
  // //             <tbody>
  // //               <tr>
  // //                 <td>Marriage Registration</td>
  // //                 <td>₹9,999</td>
  // //                 <td>Premium Plan</td>
  // //                 <td>VADE08248932</td>
  // //               </tr>
  // //             </tbody>
  // //           </table>

  // //           <p class="title">Next <span class="highlight">Step</span></p>
  // //           <ol class="steps">
  // //             <li>Submit your required documents through your dashboard.</li>
  // //             <li>Our team will review your documents.</li>
  // //             <li>Once approved, we will proceed with registration.</li>
  // //           </ol>

  // //           <div class="cta">
  // //             <a href="#" class="dashboard-btn">Go to Dashboard</a>
  // //           </div>
  // //         </div>

  // //         <footer class="footer">
  // //           <div class="social-links">
  // //            <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
  // //               <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" style="margin-Right:5px" />
  // //             </a>
  // //             <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
  // //               <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" style="margin-Left:5px" />
  // //             </a>
  // //           </div>

  // //           <div class="footer-links">
  // //             <a href="/">Home</a>
  // //             <a href="/urPackages">Our Packages</a>
  // //             <a href="/aboutUs">Who We Are</a>
  // //             <a href="/services">Services</a>
  // //             <a href="/blogs">Blogs</a>
  // //             <a href="/contactUs">Contact Us</a>
  // //           </div>

  // //           <p class="footer-text">
  // //             You have received this email as a registered user of
  // //             <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
  // //             You can <a href="#">unsubscribe</a> from these emails here.
  // //           </p>
  // //         </footer>
  // //       </div>
  // //     </div>
  // //   </body>
  // // </html>
  // // `;
  let html = `
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>Marriage Registration Confirmation</title>

    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <style>
      * {
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 50%, #f1b0b7 100%);
        margin: 0;
        padding: 20px;
        color: #2d3748;
        line-height: 1.6;
        min-height: 100vh;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        position: relative;
      }

      .header {
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 30%, #f1b0b7 100%);
        padding: 40px 20px;
        text-align: center;
        position: relative;
        overflow: hidden;
        border-bottom: 2px solid rgba(241, 176, 183, 0.3);
      }

      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
        animation: shimmer 3s ease-in-out infinite;
      }

      @keyframes shimmer {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(180deg); }
      }

      .logo-container {
        position: relative;
        z-index: 2;
        margin-bottom: 20px;
      }

      .logo {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #f1b0b7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 10px 25px rgba(241, 176, 183, 0.4);
        backdrop-filter: blur(10px);
      }

      .logo i {
        font-size: 32px;
        color: #d1477a;
      }

      .header-title {
        color: #6b2c41;
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 10px rgba(107, 44, 65, 0.2);
        position: relative;
        z-index: 2;
      }

      .header-subtitle {
        color: #8b4d63;
        font-size: 16px;
        font-weight: 400;
        margin: 8px 0 0;
        position: relative;
        z-index: 2;
      }

      .content {
        padding: 50px 40px;
      }

      .success-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #f1b0b7, #e68a9a);
        color: #6b2c41;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 30px;
        box-shadow: 0 4px 15px rgba(230, 138, 154, 0.3);
        border: 1px solid rgba(241, 176, 183, 0.5);
      }

      .success-badge i {
        font-size: 16px;
      }

      .main-title {
        font-size: 32px;
        font-weight: 700;
        color: #1a202c;
        margin: 0 0 16px;
        line-height: 1.2;
      }

      .highlight {
        background: linear-gradient(135deg, #d1477a, #b8336b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .description {
        font-size: 18px;
        color: #4a5568;
        margin-bottom: 40px;
        line-height: 1.7;
      }

      .section-title {
        font-size: 24px;
        font-weight: 600;
        color: #2d3748;
        margin: 40px 0 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .section-title i {
        color: #d1477a;
        font-size: 20px;
      }

      .plan-details {
        background: linear-gradient(135deg, #fdf2f2, #f9e8e8);
        border: 2px solid #f1b0b7;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 40px;
        box-shadow: 0 4px 15px rgba(241, 176, 183, 0.2);
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
      }

      .table thead {
        background: linear-gradient(135deg, #f1b0b7, #e68a9a);
      }

      .table thead th {
        color: #6b2c41;
        padding: 20px 24px;
        font-weight: 600;
        font-size: 15px;
        text-align: left;
        border: none;
      }

      .table tbody td {
        padding: 20px 24px;
        font-size: 16px;
        color: #2d3748;
        border: none;
        background: white;
      }

      .table tbody tr:hover {
        background: #fdf2f2;
        transition: background 0.2s ease;
      }

      .amount {
        font-weight: 700;
        color: #d1477a;
        font-size: 18px;
      }

      .transaction-id {
        font-family: 'Monaco', 'Menlo', monospace;
        background: #f9e8e8;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 14px;
        color: #6b2c41;
        border: 1px solid #f1b0b7;
      }

      .steps {
        background: linear-gradient(135deg, #ffffff, #fdf2f2);
        border: 2px solid #f1b0b7;
        border-radius: 16px;
        padding: 30px;
        margin-bottom: 40px;
        box-shadow: 0 4px 15px rgba(241, 176, 183, 0.15);
      }

      .steps ol {
        margin: 0;
        padding-left: 0;
        list-style: none;
        counter-reset: step-counter;
      }

      .steps li {
        counter-increment: step-counter;
        margin-bottom: 20px;
        padding-left: 60px;
        position: relative;
        font-size: 16px;
        color: #4a5568;
        line-height: 1.6;
      }

      .steps li:last-child {
        margin-bottom: 0;
      }

      .steps li::before {
        content: counter(step-counter);
        position: absolute;
        left: 0;
        top: 0;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #f1b0b7, #e68a9a);
        color: #6b2c41;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 16px;
        box-shadow: 0 4px 15px rgba(230, 138, 154, 0.3);
        border: 2px solid #ffffff;
      }

      .cta {
        text-align: center;
        margin: 50px 0;
         color: #ffffff !important;
      }

      .dashboard-btn {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        background: linear-gradient(135deg, #d1477a, #b8336b);
        color: #ffffff !important;
        padding: 16px 32px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 8px 25px rgba(209, 71, 122, 0.4);
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }

      .dashboard-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(184, 51, 107, 0.5);
        background: linear-gradient(135deg, #b8336b, #a02a5c);
        
      }

      .dashboard-btn i {
        font-size: 18px;
        
      }
        .ii a[href] {
    color: #dfe2e7;
}


      .footer {
        background: linear-gradient(135deg, #fdf2f2, #f9e8e8);
        padding: 40px;
        border-top: 2px solid #f1b0b7;
        text-align: center;
      }

      .social-links {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-bottom: 30px;
         color: #ffffff !important;
      }

      

      .footer-links {
        margin: 30px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 30px;
      }

      .footer-links a {
        text-decoration: none;
        font-size: 15px;
        color: #4a5568;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .footer-links a:hover {
        color: #e53e3e;
      }
       .social-links {
        display: flex;
        justify-content: center; /* Center social icons */
        gap: 20px; /* Increased gap for better spacing */
        margin-bottom: 24px; /* More space below icons */
      }

      .social-links a img {
        width: 36px; /* Optimized icon size */
        height: 36px;
        object-fit: contain;
        transition: opacity 0.3s ease; /* Smooth hover effect */
      }

       .social-links a:hover img {
        opacity: 0.8; /* Hover effect for icons */
      }
      .footer-text {
        font-size: 14px;
        color: #718096;
        margin-top: 30px;
        line-height: 1.6;
      }

      .footer-text a {
       color: #b8336b;
        text-decoration: none;
        font-weight: 500;
      }

      .footer-text a:hover {
        text-decoration: underline;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        body {
          padding: 10px;
        }

        .content {
          padding: 30px 20px;
        }

        .main-title {
          font-size: 24px;
        }

        .description {
          font-size: 16px;
        }

        .table thead th,
        .table tbody td {
          padding: 16px 12px;
          font-size: 14px;
        }

        .steps {
          padding: 20px;
        }

        .steps li {
          padding-left: 50px;
        }

        .footer {
          padding: 30px 20px;
        }

        .footer-links {
          gap: 30px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <div class="logo">
             <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Logo" class="logo" />
          </div>
        </div>
        <h1 class="header-title">Marriage Registration Wala</h1>
        <p class="header-subtitle">Your Trusted Marriage Registration Partner</p>
      </div>

      <div class="content">
        <div class="success-badge">
          <i class="fas fa-check-circle"></i>
          Plan Confirmed Successfully
        </div>

         <h1 class="main-title">
              Hello ${userName}, your <span class="highlight">${planName}</span> is active!
            </h1>

       <p class="description">
              Congratulations! Your ${planName} has been successfully activated. Our expert team is now ready to guide you through a seamless marriage registration process with personalized support every step of the way.
            </p>

        <h2 class="section-title">
          <i class="fas fa-file-contract"></i>
          Plan Details
        </h2>

        <div class="plan-details">
          <table class="table">
            <thead>
              <tr>
                <th>Service Plan</th>
                <th>Amount Paid</th>
                <th>Plan Type</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                    <td>Marriage Registration</td>
                    <td class="amount">${amountPaid}</td>
                    <td>${planName}</td>
                    <td><span class="transaction-id">${transactionId}</span></td>
                  </tr>
            </tbody>
          </table>
        </div>

        <h2 class="section-title">
          <i class="fas fa-route"></i>
          Next Steps
        </h2>

        <div class="steps">
          <ol>
            <li>Access your personalized dashboard and upload all required documents securely</li>
            <li>Our legal experts will thoroughly review and verify your submitted documents</li>
            <li>We'll handle the complete registration process and keep you updated throughout</li>
          </ol>
        </div>

        <div class="cta">
           <a href="${dashboardUrl}" class="dashboard-btn">
                Access Your Dashboard
              </a>
        </div>
      </div>

      <footer class="footer">
           <div class="social-links">
           <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
              <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" style="margin-Right:5px" />
            </a>
            <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
              <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" style="margin-Left:5px" />
            </a>
          </div>

          <div class="footer-links">
            <a href="/">Home</a>
            <a href="/urPackages">Our Packages</a>
            <a href="/aboutUs">Who We Are</a>
            <a href="/services">Services</a>
            <a href="/blogs">Blogs</a>
            <a href="/contactUs">Contact Us</a>
          </div>

          <p class="footer-text">
            You have received this email as a registered user of
            <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
            You can <a href="#">unsubscribe</a> from these emails here.
          </p>
        </footer>
    </div>
  </body>
</html>`;

  return html;
};

interface WelcomeDetails {
  userName: string;
  profileUrl: string;
  plansUrl: string;
  frontendUrl: string;
}

export const welcomeEmail = (name: string, email: string) => {
  let html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>Welcome to Marriage Registration</title>

    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background: #fdf2f8;
        margin: 0;
        padding: 0;
        color: #831843;
      }

      .container {
        padding: 24px;
      }

      .card {
        max-width: 960px;
        margin: auto;
        background: white;
        box-shadow: 0 4px 10px rgba(236, 72, 153, 0.1);
        border-radius: 12px;
        overflow: hidden;
      }

      .header {
        text-align: center;
        background: linear-gradient(to bottom, #fce7f3, #ffffff);
        padding: 32px 16px;
      }

      .logo {
        width: 120px;
        height: auto;
        object-fit: contain;
        margin-bottom: 12px;
      }

      .inner_section {
        padding: 0 3rem 2rem;
      }

      .banner_section {
        position: relative;
        margin-bottom: 2rem;
      }

      .banner {
        width: 100%;
        height: 300px;
        border-radius: 10px;
        object-fit: cover;
      }

      .banner_heading {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: 600;
        color: white;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        text-align: center;
        padding: 0 1rem;
      }

      .title {
        font-size: 28px;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
      }

      .highlight {
        color: #ec4899;
      }

      .description {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 2rem;
      }

      .welcome-box {
        background: linear-gradient(135deg, #fce7f3, #fdf2f8);
        border: 2px solid #ec4899;
        border-radius: 12px;
        padding: 2rem;
        margin: 2rem 0;
        text-align: center;
      }

      .welcome-icon {
        font-size: 48px;
        color: #ec4899;
        margin-bottom: 1rem;
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
      }

      .feature-item {
        background: #fef7ff;
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #f3e8ff;
      }

      .feature-icon {
        font-size: 24px;
        color: #ec4899;
        margin-bottom: 0.5rem;
      }

      .steps {
        padding-left: 1.5rem;
        font-size: 18px;
        line-height: 1.8;
        margin-bottom: 2rem;
      }

      .cta {
        text-align: center;
        margin: 2.5rem 0;
      }

      .dashboard-btn {
        background: #ec4899;
        color: white;
        padding: 14px 30px;
        border-radius: 30px;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        margin: 0 10px;
        display: inline-block;
      }

      .secondary-btn {
        background: transparent;
        color: #ec4899;
        border: 2px solid #ec4899;
        padding: 12px 28px;
        border-radius: 30px;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        margin: 0 10px;
        display: inline-block;
      }

      .footer {
        background: linear-gradient(to top, #fce7f3, #ffffff);
        padding: 2rem 3rem;
        border-top: 1px solid #f9a8d4;
        text-align: center;
      }

      .social-links {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 16px;
      }

      .social-links img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        transition: transform 0.3s;
      }

      .social-links img:hover {
        transform: scale(1.1);
      }

      .footer-links {
        margin: 1rem 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
      }

      .footer-links a {
        text-decoration: none;
        font-size: 16px;
        color: #831843;
      }

      .footer-text {
        font-size: 14px;
        color: #9d174d;
        margin-top: 1rem;
      }

      .footer-text a {
        color: #be185d;
        text-decoration: underline;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Logo" class="logo" />
        </div>

        <div class="inner_section">
          <div class="banner_section">

            <div class="banner_heading">
              Welcome  to Marriage Registration Wala
            </div>
          </div>

          <div class="welcome-box">
            <div class="welcome-icon">🎉</div>
           <p class="title">
                  Welcome, <span class="highlight">${name}</span>!
                </p>
            <p class="description">
              Thank you for joining us! We're thrilled to have you as part of our community. Your account has been successfully created, and you're now ready to begin your marriage registration journey with us.
            </p>
          </div>

          <p class="title">Why Choose <span class="highlight">Us?</span></p>

          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <h4>Fast Processing</h4>
              <p>Quick and efficient marriage registration process with minimal paperwork.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🛡️</div>
              <h4>100% Legal</h4>
              <p>Fully compliant with government regulations and legal requirements.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👥</div>
              <h4>Expert Support</h4>
              <p>Dedicated team of professionals to guide you through every step.</p>
            </div>
          </div>

          <p class="title">Getting <span class="highlight">Started</span></p>
          <ol class="steps">
            <li>Complete your profile by adding your personal information.</li>
            <li>Choose the plan that best suits your needs.</li>
            <li>Upload the required documents securely.</li>
            <li>Our team will guide you through the registration process.</li>
            <li>Receive your marriage certificate once completed.</li>
          </ol>

          <div class="cta">
            <a href="#" class="dashboard-btn">Complete Your Profile</a>
            <a href="#" class="secondary-btn">View Our Plans</a>
          </div>
        </div>

       <footer class="footer">
          <div class="social-links">
           <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
              <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" style="margin-Right:5px" />
            </a>
            <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
              <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" style="margin-Left:5px" />
            </a>
          </div>

          <div class="footer-links">
            <a href="/">Home</a>
            <a href="/urPackages">Our Packages</a>
            <a href="/aboutUs">Who We Are</a>
            <a href="/services">Services</a>
            <a href="/blogs">Blogs</a>
            <a href="/contactUs">Contact Us</a>
          </div>

          <p class="footer-text">
            You have received this email as a registered user of
            <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
            You can <a href="#">unsubscribe</a> from these emails here.
          </p>
        </footer>
      </div>
    </div>
  </body>
</html>`;

  return html;
};

export const documentSumittedSuccessfully = async (
  name: string,
  email: string,
  frontendUrl: string
) => {
  let html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
    <title>Forget Password</title>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(to bottom, #f8d7da, #f5c6cb, #f1b0b7);
        color: #6b2c41;
      }

      .container {
        padding: 24px;
      }

      .card {
        max-width: 700px;
        margin: auto;
        background: linear-gradient(to bottom right, #fff5f7, #ffeef0);
        box-shadow: 0 10px 15px rgba(209, 71, 122, 0.1), 0 4px 6px rgba(209, 71, 122, 0.05);
        border-radius: 12px;
        overflow: hidden;
      }

      .header {
        text-align: center;
        background: linear-gradient(to bottom, #ffe4e9, #fff0f2);
        padding: 24px 0;
        border-bottom: 1px solid #f8d7da;
      }

        .logo {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #f1b0b7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 10px 25px rgba(241, 176, 183, 0.4);
        backdrop-filter: blur(10px);
      }

      .inner_section {
        padding: 0 4rem 24px;
      }

      .banner_section {
        position: relative;
        padding-bottom: 2rem;
      }

      .banner_section .banner_heading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        font-weight: 500;
        color: #6b2c41;
        padding: 0 1rem;
       
        border-radius: 8px;
      }

      .title {
        font-size: 28px;
        font-weight: 500;
        margin: 0;
        padding-top: 2rem;
        padding-bottom: 1rem;
        color: #6b2c41;
      }

      .highlight {
        font-size: 28px;
        font-weight: 600;
       
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .description {
        color: #6b2c41;
        font-size: 18px;
        font-weight: 400;
        line-height: 1.6;
        margin-bottom: 1.75rem;
        margin-top: 0.25rem;
      }

      .cta {
        margin-top: 2.75rem;
        margin-bottom: 2.75rem;
        text-align: center;
      }

       .cta a {
      
         color: #ffffff !important;
      }
      .dashboard-btn {
        background: linear-gradient(to right, #d1477a, #b8336b);
        color: white;
        padding: 16px 32px;
        border-radius: 3rem;
        font-size: 18px;
        font-weight: 600;
        text-decoration: none;
        transition: background-color 0.3s ease;
        display: inline-block;
      }

      .dashboard-btn:hover {
        background: #a52a5a;
      }

      .footer {
        border-top: 1px solid #f8d7da;
        padding: 24px 4rem;
        background: linear-gradient(to top, #ffe4e9, #fff0f2);
        text-align: center;
      }

      .social-links {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 24px;
      }

      .social-links a img {
        width: 36px;
        height: 36px;
       
        padding: 4px;
        transition: all 0.3s ease;
      }

    

      .footer-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
        padding-top: 0.35rem;
        margin-bottom: 1rem;
      }

      .footer-links a {
        text-decoration: none;
        font-size: 16px;
        font-weight: 400;
        color: #6b2c41;
        transition: color 0.3s ease;
      }

      .footer-links a:hover {
        color: #d1477a;
      }

      .footer-text {
        font-size: 14px;
        font-weight: 400;
        color: #6b2c41;
        padding-top: 1rem;
        margin: 0;
        line-height: 1.5;
      }

      .footer-text a {
        color: #b8336b;
        text-decoration: none;
        font-weight: 500;
      }

      .footer-text a:hover {
        text-decoration: underline;
      }

      @media (max-width: 600px) {
        .inner_section {
          padding: 0 1.5rem 24px;
        }

        .footer {
          padding: 24px 1.5rem;
        }

        .title,
        .highlight {
          font-size: 24px;
        }

        .description {
          font-size: 16px;
        }

        .banner_section .banner_heading {
          font-size: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Logo" class="logo" />
        </div>

        <div class="inner_section">
          <div class="banner_section">
            <h2 class="banner_heading">Your Documents Have Been Submitted Successfully</h2>
          </div>

          <p class="title">
            Dear <span class="highlight"> ${name},</span>
          </p>
          <p class="description">
            We have received your documents for marriage registration. Our team will review them and update you on the status shortly.
          </p>
          <div class="cta">
            <a href="${frontendUrl}" class="dashboard-btn">Go to Dashboard</a>
          </div>
        </div>

        <footer class="footer">
          <div class="social-links">
            <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
              <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" />
            </a>
            <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
              <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" />
            </a>
          </div>

          <div class="footer-links">
            <a href="/">Home</a>
            <a href="/urPackages">Our Packages</a>
            <a href="/aboutUs">Who We Are</a>
            <a href="/services">Services</a>
            <a href="/blogs">Blogs</a>
            <a href="/contactUs">Contact Us</a>
          </div>

          <p class="footer-text">
            You have received this email as a registered user of
            <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
            You can <a href="#">unsubscribe</a> from these emails here.
          </p>
        </footer>
      </div>
    </div>
  </body>
</html>`;

  return html;
};

export const successfullDocumentVerification = async (name: string) => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
  <title>Documents Verified</title>

  <style>
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #f8d7da, #f5c6cb, #f1b0b7);
      color: #6b2c41;
    }

    .container {
      padding: 24px;
    }

    .card {
      max-width: 700px;
      margin: auto;
      background: linear-gradient(to bottom right, #fff5f7, #ffeef0);
      box-shadow: 0 10px 15px rgba(209, 71, 122, 0.1), 0 4px 6px rgba(209, 71, 122, 0.05);
      border-radius: 12px;
      overflow: hidden;
    }

    .header {
      text-align: center;
      background: linear-gradient(to bottom, #ffe4e9, #fff0f2);
      padding: 24px 0;
      border-bottom: 1px solid #f8d7da;
    }

     .logo {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #f1b0b7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 10px 25px rgba(241, 176, 183, 0.4);
        backdrop-filter: blur(10px);
      }

    .inner_section {
      padding: 0 4rem 24px;
    }

    .banner_section {
      position: relative;
      padding-bottom: 2rem;
    }

    .banner_section .banner_heading {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 500;
      color: #6b2c41;
      padding: 0 1rem;
     
      border-radius: 8px;
      text-align: center;
    }

    .title {
      font-size: 28px;
      font-weight: 500;
      margin: 0;
      padding-top: 2rem;
      padding-bottom: 1rem;
      color: #6b2c41;
    }

    .highlight {
      font-size: 28px;
      font-weight: 600;
     
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .description {
      color: #6b2c41;
      font-size: 18px;
      font-weight: 400;
      line-height: 1.6;
      margin-bottom: 1.75rem;
      margin-top: 0.25rem;
    }

    .footer {
      border-top: 1px solid #f8d7da;
      padding: 24px 4rem;
      background: linear-gradient(to top, #ffe4e9, #fff0f2);
      text-align: center;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 24px;
    }

    .social-links a img {
      width: 36px;
      height: 36px;
      padding: 4px;
      transition: all 0.3s ease;
    }

    .social-links a:hover img {
      border-color: #d1477a;
      background-color: #ffe5ec;
      opacity: 0.85;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      padding-top: 0.35rem;
      margin-bottom: 1rem;
      flex-direction: row-reverse;
    }

    .footer-links a {
      text-decoration: none;
      font-size: 16px;
      font-weight: 400;
      color: #6b2c41;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #d1477a;
    }

    .footer-text {
      font-size: 14px;
      font-weight: 400;
      color: #6b2c41;
      padding-top: 1rem;
      margin: 0;
      line-height: 1.5;
    }

    .footer-text a {
      color: #b8336b;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-text a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .inner_section {
        padding: 0 1.5rem 24px;
      }
      .footer {
        padding: 24px 1.5rem;
      }
      .title,
      .highlight {
        font-size: 24px;
      }
      .description {
        font-size: 16px;
      }
      .banner_section .banner_heading {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Logo" class="logo" />
      </div>

      <div class="inner_section">
        <div class="banner_section">
          <h2 class="banner_heading">Hi ${name},</h2>
          <h2 class="banner_heading">Your Documents Have Been Verified Documents Have Been Verified</h2>
        </div>

        <p class="title">
          Dear <span class="highlight">${
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
          }</span>
        </p>
        <p class="description">
          We are pleased to inform you that your documents have been successfully verified. Your marriage registration process is now moving to the next step.
        </p>

        <p class="description">
          We will notify you once your registration is complete.
        </p>
      </div>

      <footer class="footer">
        <div class="social-links">
          <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" />
          </a>
        </div>

        <div class="footer-links">
          <a href="/contactUs">Contact Us</a>
          <a href="/blogs">Blogs</a>
          <a href="/services">Services</a>
          <a href="/aboutUs">Who We Are</a>
          <a href="/urPackages">Our Packages</a>
          <a href="/">Home</a>
        </div>

        <p class="footer-text">
          You have received this email as a registered user of
          <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
          You can <a href="#">unsubscribe</a> from these emails here.
        </p>
      </footer>
    </div>
  </div>
</body>
</html>
`;

  return html;
};

export const documentRejectionAndReUpload = async (
  remark: string,
  name: string,
  frontendUrl: string
) => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
  <title>Action Required: Re-upload Documents</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #f8d7da, #f5c6cb, #f1b0b7);
      color: #6b2c41;
    }

    .container {
      padding: 24px;
    }

    .card {
      max-width: 700px;
      margin: auto;
      background: linear-gradient(to bottom right, #fff5f7, #ffeef0);
      box-shadow: 0 10px 15px rgba(209, 71, 122, 0.1), 0 4px 6px rgba(209, 71, 122, 0.05);
      border-radius: 12px;
      overflow: hidden;
    }

    .header {
      text-align: center;
      background: linear-gradient(to bottom, #ffe4e9, #fff0f2);
      padding: 24px 0;
      border-bottom: 1px solid #f8d7da;
    }

    .logo {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #f1b0b7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 10px 25px rgba(241, 176, 183, 0.4);
        backdrop-filter: blur(10px);
      }



    .inner_section {
      padding: 0 4rem 24px;
    }

    .banner_section {
      position: relative;
      padding-bottom: 2rem;
    }

    .banner_section .banner_heading {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 500;
      color: #6b2c41;
      padding: 0 1rem;
     
      border-radius: 8px;
      text-align: center;
    }

    .title {
      font-size: 28px;
      font-weight: 500;
      margin: 0;
      padding-top: 2rem;
      padding-bottom: 1rem;
      color: #6b2c41;
    }

    .highlight {
      font-size: 28px;
      font-weight: 600;
     
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }



    .description,
    .description2 {
      color: #6b2c41;
      font-size: 18px;
      font-weight: 400;
      line-height: 1.6;
      margin: 0.5rem 0;
    }

    .description2 {
      margin-top: 1.5rem;
      margin-bottom: 1.75rem;
    }

    .color_section {
      background-color: #fff0f2;
      border-radius: 10px;
      padding: 20px;
      margin-top: 1rem;
      border-left: 4px solid #d1477a;
    }

    .color_section h6 {
      font-size: 20px;
      font-weight: 600;
      color: #6b2c41;
      margin: 0 0 0.75rem;
    }

    .color_section p {
      font-size: 16px;
      font-weight: 400;
      color: #6b2c41;
      margin: 0;
      line-height: 1.6;
    }

    .cta {
      margin: 2.75rem 0;
      text-align: center;
    }
.cta a{
  color: #ffffff !important;
  font-size: 18px;
}
    .dashboard-btn {
      background: linear-gradient(to right, #d1477a, #b8336b);
      color: white;
      padding: 16px 32px;
      border-radius: 3rem;
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      transition: background 0.3s ease;
    }

    .dashboard-btn:hover {
      background: #a52a5a;
    }

    .footer {
      border-top: 1px solid #f8d7da;
      padding: 24px 4rem;
      background: linear-gradient(to top, #ffe4e9, #fff0f2);
      text-align: center;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 24px;
    }

   .social-links a img {
      width: 36px;
      height: 36px;
      padding: 4px;
      transition: all 0.3s ease;
    } 


    .social-links a:hover img {
      border-color: #d1477a;
      background-color: #ffe5ec;
      opacity: 0.85;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      padding-top: 0.35rem;
      margin-bottom: 1rem;
      flex-direction: row-reverse;
    }

    .footer-links a {
      text-decoration: none;
      font-size: 16px;
      font-weight: 400;
      color: #6b2c41;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #d1477a;
    }

    .footer-text {
      font-size: 14px;
      font-weight: 400;
      color: #6b2c41;
      padding-top: 1rem;
      margin: 0;
      line-height: 1.5;
    }

    .footer-text a {
      color: #b8336b;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-text a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .inner_section {
        padding: 0 1.5rem 24px;
      }
      .footer {
        padding: 24px 1.5rem;
      }
      .title, .highlight {
        font-size: 22px;
      }
      .description, .description2 {
        font-size: 16px;
      }
      .banner_section .banner_heading {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Logo" class="logo" />
      </div>

      <div class="inner_section">
        <div class="banner_section">
          <h2 class="banner_heading">Action Required – Re-upload Your Documents</h2>
        </div>

        <p class="title">Dear <span class="highlight">${
          name.charAt(0).toUpperCase() + name.slice(1)
        }</span></p>
        <p class="description">
          We have reviewed your submitted documents and found an issue with the following:
        </p>

        <p class="highlight">1. Aadhar Card</p>

        <div class="color_section">
          <h6>Rejection Reason:</h6>
          <p>
            ${remark} The information provided in your submitted document does not match the details you entered during the application process. This could include discrepancies in your name, date of birth, address, or other essential details.
          </p>
        </div>

        <p class="description2">
          Please re-upload the correct document at your earliest convenience to avoid delays in processing your marriage registration.
        </p>

        <div class="cta">
          <a href={${frontendUrl}} class="dashboard-btn">Upload Documents Now</a>
        </div>
      </div>

      <footer class="footer">
        <div class="social-links">
          <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" />
          </a>
        </div>

        <div class="footer-links">
          <a href="/contactUs">Contact Us</a>
          <a href="/blogs">Blogs</a>
          <a href="/services">Services</a>
          <a href="/aboutUs">Who We Are</a>
          <a href="/urPackages">Our Packages</a>
          <a href="/">Home</a>
        </div>

        <p class="footer-text">
          You have received this email as a registered user of
          <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
          You can <a href="#">unsubscribe</a> from these emails here.
        </p>
      </footer>
    </div>
  </div>
</body>
</html>
 `;

  return html;
};

export const forgetPasswordTemplate = async (
  name: string,
  resetUrl: string
) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #f8d7da, #f5c6cb, #f1b0b7);
      color: #6b2c41;
    }

    .container {
      background: transparent;
      padding: 24px;
    }

    .card {
      max-width: 600px;
      margin: auto;
      background: linear-gradient(to bottom right, #fff5f7, #ffeef0);
      box-shadow: 0 10px 15px rgba(209, 71, 122, 0.1), 0 4px 6px rgba(209, 71, 122, 0.05);
      border-radius: 12px;
      overflow: hidden;
    }

    .header {
      text-align: center;
      background: linear-gradient(to bottom, #ffe4e9, #fff0f2);
      padding: 20px 0;
      border-bottom: 1px solid #f8d7da;
    }

     .logo {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #f1b0b7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 10px 25px rgba(241, 176, 183, 0.4);
        backdrop-filter: blur(10px);
      }


    .inner_section {
      padding: 24px 2rem;
    }

    .title {
      font-size: 26px;
      font-weight: 600;
      margin: 0;
      padding-top: 1rem;
      padding-bottom: 1rem;
      color: #6b2c41;
      text-align: center;
    }

    .highlight {
      font-size: 28px;
      font-weight: 600;
     
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }



    .description,
    .note {
      color: #6b2c41;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.6;
      margin: 0.5rem 0;
    }

    .note {
      font-size: 14px;
      margin-top: 1.5rem;
    }

    .cta {
      margin-top: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .action-btn {
      display: inline-block;
      background: linear-gradient(to right, #d1477a, #b8336b);
      color: white !important;
      padding: 12px 28px;
      border-radius: 3rem;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.3s ease;
    }

    .action-btn:hover {
      background: #a52a5a;
    }

    .footer {
      border-top: 1px solid #f8d7da;
      padding: 24px 2rem;
      background: linear-gradient(to top, #ffe4e9, #fff0f2);
      text-align: center;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 24px;
    }

  .social-links a img {
      width: 36px;
      height: 36px;
      padding: 4px;
      transition: all 0.3s ease;
    } 


    .social-links a:hover img {
      border-color: #d1477a;
      background-color: #ffe5ec;
      opacity: 0.85;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
      flex-direction: row-reverse;
    }

    .footer-links a {
      text-decoration: none;
      font-size: 16px;
      font-weight: 400;
      color: #6b2c41;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #d1477a;
    }

    .footer-text {
      font-size: 14px;
      font-weight: 400;
      color: #6b2c41;
      margin: 0;
      line-height: 1.5;
    }

    .footer-text a {
      color: #b8336b;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-text a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .inner_section {
        padding: 0 1.5rem 24px;
      }

      .title {
        font-size: 22px;
      }

      .description, .note {
        font-size: 15px;
      }

      .footer {
        padding: 24px 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Marriage Registration Wala Logo" class="logo" />
      </div>

      <div class="inner_section">
        <h2 class="title">Reset Your Password</h2>
        <p class="description">Hi <span class="highlight">${name}</span>,</p>
        <p class="description">
          We received a request to reset the password associated with your account. Click the button below to set a new password.
        </p>
        <div class="cta">
          <a href="${resetUrl}" class="action-btn">Reset Password</a>
        </div>
        <p class="note">
          For your security, this link will expire in 15 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>

      <footer class="footer">
        <div class="social-links">
          <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" />
          </a>
        </div>

        <div class="footer-links">
          <a href="/contactUs">Contact Us</a>
          <a href="/blogs">Blogs</a>
          <a href="/services">Services</a>
          <a href="/aboutUs">Who We Are</a>
          <a href="/urPackages">Our Packages</a>
          <a href="/">Home</a>
        </div>

        <p class="footer-text">
          You have received this email as a registered user of
          <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
          You can <a href="#">unsubscribe</a> from these emails here.
        </p>
      </footer>
    </div>
  </div>
</body>
</html>
`;

  return html;
};

//   let html = `<!doctype html>
//   <html lang="en">
//       <head>
//           <meta charset="UTF-8">
//           <meta http-equiv="X-UA-Compatible" content="IE=edge">
//           <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
//           <title>Forget Password</title>
//       </head>

//       <body width="100%" bgcolor="#f0f0f0" style="margin: 20px 0;">
//           <div class="main-block" style=" background: #f0f0f0;">
//               <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin: auto; background: #fff; padding: 0px; border-radius: 15px; overflow: hidden; width: 800px;" class="email-container">
//                   <tbody>
//                       <tr>
//                           <td bgcolor="#fff" dir="ltr" align="center" valign="top" width="100%" style="padding:15px;background: #EF6039">
//                               <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
//                                   <tr>
//                                       <td class="stack-column-center">
//                                           <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
//                                               <tr>
//                                                   <td dir="ltr" valign="top" style="padding: 0px;">
//                                                       <p style="font-size: 16px; text-align:center ! important; font-weight: normal;color: #ffffff;line-height: 24px;margin: 0 0 10px;">AUTOCRANK </p>
//                                                   </td>
//                                               </tr>
//                                           </table>
//                                       </td>
//                                   </tr>
//                               </table>
//                           </td>
//                       </tr>
//                       <tr>
//                           <td bgcolor="#fff" dir="ltr" align="center" valign="top" width="100%" style="padding:0px;">
//                               <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
//                                   <tr>
//                                       <td class="stack-column-center" style="padding:15px;margin: 15px 0;">

//                                              <p>Hello <strong>
//                                                   ${name}
//                                               </strong></p>
//                                               <p>Please reset your password by clicking on below link.</p>
//                                               <a href="${url}" target="_blank">Click Here</a>
//                                               <p>This link is only valid for 2 hours.</p>
//                                               <p><strong>Note:-</strong>If you are  unable to click on above link then please use the link below:</p>
//                                               <p>
//                                               ${url}
//                                               </p>
//                                           <p style="font-size: 16px;font-weight: normal;color: #111;text-align: center;line-height: 24px;margin: 0 0 25px;">
//                                                   If you have any queries  email us at helpdeskautocrank@gmail.com or call us at +01145804589. </p>

//                                       </td>
//                                   </tr>
//                               </table>
//                           </td>
//                       </tr>
//                       <tr>
//                           <td bgcolor="#fff" dir="ltr" align="center" valign="top" width="100%" style="padding:0px;">
//                               <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
//                                   <tr>
//                                       <td class="stack-column-center" style="padding:0;">
//                                           <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
//                                               <tr>
//                                                   <td dir="ltr" valign="top" style="padding: 20px 20px 20px; background:#EF6039;">
//                                                       <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
//                                                           <tr>
//                                                               <td class="stack-column-center">
//                                                                   <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style=" margin: 0 0 ;">
//                                                                       <tr>
//                                                                           <td width="40%"></td>
//                                                                           <td width="100%" dir="ltr" valign="top" style="padding: 0;">
//                                                                               <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="padding:0 15px; margin: 0 0px;">
//                                                                                   <tr>
//                                                                                       <td style="padding: 0 0 ;">

//                                                                                           <p style="font-size: 16px; text-align:center ! important; font-weight: normal;color: #ffffff;line-height: 24px;margin: 0 0 10px;">Copyright  2024 Autocrank.</p>

//                                                                                       </td>
//                                                                                   </tr>
//                                                                               </table>
//                                                                           </td>

//                                                                       </tr>
//                                                                   </table>
//                                                               </td>
//                                                           </tr>
//                                                       </table>
//                                                   </td>
//                                               </tr>
//                                           </table>
//                                       </td>
//                                   </tr>
//                               </table>
//                           </td>
//                       </tr>
//                   </tbody>
//               </table>
//           </div>
//       </body>
//   </html>`;

//   return html;
// };

export const contactQueryTemplate = async (
  name: string,
  phone: string,
  email: string,
  message: string
) => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>New Query Received</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #f8d7da, #f5c6cb, #f1b0b7);
      color: #6b2c41;
    }

    .email-container {
      max-width: 600px;
      margin: auto;
      background: #fff5f7;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 15px rgba(209, 71, 122, 0.1), 0 4px 6px rgba(209, 71, 122, 0.05);
    }

    .header {
      background: linear-gradient(to bottom, #ffe4e9, #fff0f2);
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #f8d7da;
    }

  .logo {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid #f1b0b7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 10px 25px rgba(241, 176, 183, 0.4);
        backdrop-filter: blur(10px);
      }



    .content-section {
      padding: 24px 2rem;
      color: #6b2c41;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .query-item {
      font-size: 16px;
      font-weight: 400;
      line-height: 1.6;
      margin-bottom: 0.75rem;
    }

    .query-item strong {
      font-weight: 600;
      color: #b8336b;
    }

    .footer {
      background: linear-gradient(to top, #ffe4e9, #fff0f2);
      border-top: 1px solid #f8d7da;
      text-align: center;
      padding: 24px 2rem;
    }

    .footer-text {
      font-size: 14px;
      color: #6b2c41;
      line-height: 1.5;
      margin: 0;
    }

    .footer-text a {
      color: #b8336b;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-text a:hover {
      text-decoration: underline;
    }
      .social-links a img {
      width: 36px;
      height: 36px;
      padding: 4px;
      transition: all 0.3s ease;
    } 



    @media screen and (max-width: 620px) {
      .email-container {
        border-radius: 0 !important;
      }
      .content-section, .footer {
        padding: 16px !important;
      }
      .logo {
        width: 150px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://marriage.registration.ebslonserver3.com/mrige.webp" alt="Marriage Registration Wala Logo" class="logo" />
    </div>

    <div class="content-section">
      <h2 class="section-title">New Query Received</h2>
      <p class="query-item"><strong>Name:</strong> ${name}</p>
      <p class="query-item"><strong>Email:</strong> ${email}</p>
      <p class="query-item"><strong>Phone:</strong> ${phone}</p>
      <p class="query-item"><strong>Message:</strong></p>
      <p class="query-item" style="margin-top: 0;">${message}</p>
    </div>

   <footer class="footer">
        <div class="social-links">
          <a href="https://www.facebook.com/people/Marriage-Registration-Wala/61571110832037" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/facebook.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/marriageregistrationwala" target="_blank">
            <img src="https://marriage.registration.ebslonserver3.com/instagram.png" alt="Instagram" />
          </a>
        </div>

        <div class="footer-links">
          <a href="/contactUs">Contact Us</a>
          <a href="/blogs">Blogs</a>
          <a href="/services">Services</a>
          <a href="/aboutUs">Who We Are</a>
          <a href="/urPackages">Our Packages</a>
          <a href="/">Home</a>
        </div>

        <p class="footer-text">
          You have received this email as a registered user of
          <a href="mailto:info@marriageregistrationwala.com">info@marriageregistrationwala.com</a>.
          You can <a href="#">unsubscribe</a> from these emails here.
        </p>
      </footer>
  </div>
</body>
</html>
`;

  return html;
};
