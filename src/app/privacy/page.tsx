import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Smart Editing - Learn how we handle your data and protect your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                Smart Editing ("we", "our", or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information 
                when you use our image and video editing tools at editing.biz.id.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-3">
                When you use our services, we may collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Files you upload:</strong> Images and videos you submit for processing</li>
                <li><strong>Usage data:</strong> Pages visited, tools used, and interaction patterns</li>
                <li><strong>Technical data:</strong> Browser type, device information, IP address</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process your files and deliver editing results</li>
                <li>Improve our services and user experience</li>
                <li>Analyze usage patterns and trends</li>
                <li>Ensure the security and integrity of our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. File Processing & Storage</h2>
              <p className="text-muted-foreground">
                <strong>Your files are processed securely.</strong> Uploaded files are temporarily 
                stored for processing and automatically deleted within 24 hours. We do not access, 
                view, or share your files unless required for processing or by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use third-party services for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                <li><strong>Supabase:</strong> File storage and database services</li>
                <li><strong>Analytics:</strong> Anonymous usage analytics</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                These services have their own privacy policies governing their use of your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Cookies</h2>
              <p className="text-muted-foreground">
                We use essential cookies to ensure proper functionality of our website. 
                We may also use analytics cookies to understand how visitors use our site. 
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your 
                data against unauthorized access, alteration, disclosure, or destruction. 
                However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground mb-3">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access your personal data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not intended for children under 13 years of age. 
                We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the 
                "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-muted-foreground mt-3">
                Email: privacy@editing.biz.id
              </p>
            </section>

            <div className="mt-12 pt-8 border-t">
              <Link href="/" className="text-primary hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
