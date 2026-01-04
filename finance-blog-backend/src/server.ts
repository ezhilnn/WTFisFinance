import 'dotenv/config';
import app from './app';
import { ADMIN_EMAIL } from './config/constants';

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║        🚀 Finance Blog Platform Backend Server           ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`👤 Admin Email: ${ADMIN_EMAIL}`);
  console.log('');
  console.log('📝 Available endpoints:');
  console.log('   GET  /health');
  console.log('   POST /api/blogs (Admin)');
  console.log('   GET  /api/blogs/published');
  console.log('   POST /api/comments');
  console.log('   POST /api/likes/toggle');
  console.log('   POST /api/views/view');
  console.log('   GET  /api/tags');
  console.log('');
  console.log('⚠️  Legal Disclaimer:');
  console.log('   This platform is for educational purposes only.');
  console.log('   Content does not constitute investment advice.');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
});