# Wikiclub Tech UU - Certificate Validator

A professional certificate validation system built with React, TypeScript, and Tailwind CSS. This application allows users to verify their Wikiclub Tech UU event certificates by entering their Certificate ID and email/name.

## Features

- 🛡️ **Instant Verification**: Validate certificates in real-time against Google Sheets data
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📱 **Mobile-First**: Fully responsive across all devices
- 🔒 **Secure**: Client-side validation with proper input sanitization
- 📊 **CSV Integration**: Direct integration with Google Sheets export
- 🔗 **Shareable**: Generate permalink for verified certificates
- ⬇️ **Download Ready**: Direct download links for verified certificates

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Data Source**: Google Sheets CSV export
- **State Management**: React Hooks
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd certificate-validator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Data Source Configuration

The application currently uses this Google Sheets CSV export URL:
```
https://docs.google.com/spreadsheets/d/1KfxWeP21U06emmQjDGQVg9cUcJbxMT29vOz6ZDTfH4I/export?format=csv
```

### Required CSV Format

The Google Sheet must have these exact columns (headers are case-sensitive):

| ID | Name | Email | Downlod Link |
|----|------|-------|--------------|
| CERT-2024-001 | John Doe | john@example.com | https://example.com/cert.pdf |

**Note**: The "Downlod Link" column name is intentionally misspelled as per the original sheet.

### Switching Data Sources

To use a different Google Sheet:

1. Open `src/utils/csvLoader.ts`
2. Update the `CSV_URL` constant with your sheet's export URL
3. Ensure your sheet has the required column headers

### Google Sheets API (Future Enhancement)

For private sheets or enhanced functionality, you can integrate with the Google Sheets API:

1. Create a Google Cloud Project
2. Enable the Google Sheets API
3. Create service account credentials
4. Share your sheet with the service account email
5. Update the CSV loader to use the API instead of public export

## Validation Logic

The application performs case-insensitive matching with the following logic:

1. **Normalization**: All inputs are converted to lowercase and trimmed of whitespace
2. **ID Matching**: Exact match required on Certificate ID
3. **Identity Verification**: Either email OR name must match exactly
4. **Error Handling**: Specific error messages for different failure scenarios

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab
2. Connect your repository to Vercel
3. Deploy with default settings
4. The app will be available at your Vercel domain

### Other Platforms

The application can be deployed to any static hosting service:

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

Build the application for production:
```bash
npm run build
```

The build artifacts will be in the `dist` directory.

## Performance Considerations

### Caching

The application implements client-side caching:
- CSV data is cached for 5 minutes
- Reduces API calls and improves performance
- Cache can be cleared programmatically

### Rate Limiting

For production use with high traffic:
- Implement server-side caching (Redis/Memcached)
- Add rate limiting to prevent abuse
- Consider using a CDN for static assets

## Security

- Input validation on all user inputs
- URL validation for download links
- No sensitive data exposed in client code
- HTTPS required for production

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Support

For issues or questions:
- Email: hello@wikiclubtech.uu
- Create an issue in this repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by Wikiclub Tech UU