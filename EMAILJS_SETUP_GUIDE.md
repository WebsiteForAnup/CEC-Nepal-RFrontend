# EmailJS Setup Guide for Contact Form

This guide will help you set up EmailJS to enable the contact form mailing system.

## Step 1: Create an EmailJS Account

1. Visit [emailjs.com](https://www.emailjs.com/)
2. Click "Sign Up Free"
3. Create an account using your email address
4. Verify your email

## Step 2: Add an Email Service

1. Log in to your EmailJS dashboard
2. Go to **Email Services** from the left menu
3. Click **Create New Service**
4. Select your email provider (Gmail, Outlook, etc.)
5. Follow the instructions to connect your email
   - **For Gmail**: You'll need to use an [App Password](https://support.google.com/accounts/answer/185833)
6. Note down your **Service ID** (format: `service_xxxxx`)

## Step 3: Create an Email Template

1. Go to **Email Templates** from the left menu
2. Click **Create New Template**
3. Fill in the template with the following settings:

### Template Settings:
- **Template Name**: `contact_form` (or your preferred name)
- **Subject**: `New Contact Form Submission from {{from_name}}`

### Template Content (HTML):
```html
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Subject:</strong> {{subject}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>
<hr>
<p><small>Reply to: {{reply_to_email}}</small></p>
```

4. Note down your **Template ID** (format: `template_xxxxx`)

## Step 4: Get Your Public Key

1. Go to **Account** from the left menu (or click on your profile)
2. Find **Public Key** section
3. Copy your Public Key (format: `xxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 5: Update Your React Component

Replace the placeholder values in [src/components/Sections/Contact.js](src/components/Sections/Contact.js):

```javascript
// Line 13: Replace 'YOUR_PUBLIC_KEY' with your actual public key
emailjs.init('YOUR_PUBLIC_KEY'); 

// Line 58: Replace 'YOUR_SERVICE_ID' with your actual service ID
.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

### Example:
```javascript
emailjs.init('abc123def456ghi789'); 

.send('service_abc123', 'template_xyz789', templateParams)
```

## Step 6: Test the Form

1. Start your React app: `npm start`
2. Navigate to the Contact section
3. Fill out the form and submit
4. Check your email for the message
5. You should also receive a confirmation alert on the website

## Troubleshooting

### Form not sending?
- Check the browser console (F12) for error messages
- Verify your Service ID and Template ID are correct
- Ensure your email service is properly connected in EmailJS

### Emails going to spam?
- Check your email spam folder
- Add EmailJS to your email allowlist
- Verify the email template formatting

### Public Key error?
- Make sure you copied the entire public key
- Don't mix up Public Key with Private Key
- Private Key should NEVER be shared or added to frontend code

## Limits

EmailJS has free tier limits:
- **Free Plan**: 200 emails/month
- **Pricing Plans**: Available if you need more

For production use with high volume, consider upgrading your plan.

## Security Notes

- The Public Key is safe to expose in your frontend code
- NEVER expose your Service ID or Template ID to unauthorized users
- If compromised, regenerate your keys in EmailJS dashboard
- Consider using environment variables for production (create `.env` file)

### Using Environment Variables (Optional):
Create a `.env` file in your project root:
```
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
```

Then update Contact.js:
```javascript
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

.send(
  process.env.REACT_APP_EMAILJS_SERVICE_ID,
  process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  templateParams
)
```

## Support

For more help:
- Visit [EmailJS Documentation](https://www.emailjs.com/docs/)
- Check their [FAQs](https://www.emailjs.com/docs/faq/)
