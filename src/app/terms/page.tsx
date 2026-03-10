import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Smart Editing - Read our terms and conditions for using our editing tools.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Smart Editing (editing.biz.id), you accept and agree to be 
                bound by the terms and provisions of this agreement. If you do not agree to abide 
                by these terms, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Smart Editing provides free online image and video editing tools, including but 
                not limited to: image cropping, background removal, image upscaling, and video 
                trimming. All services are provided "as is" without any guarantees.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground mb-3">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the service only for lawful purposes</li>
                <li>Not upload content that infringes on intellectual property rights</li>
                <li>Not upload malicious, harmful, or illegal content</li>
                <li>Not attempt to disrupt or damage our services</li>
                <li>Not use automated systems to access the service without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                <strong>Your Content:</strong> You retain all rights to the content you upload. 
                By using our service, you grant us a limited license to process your content 
                solely for providing the requested editing service.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Our Service:</strong> The Smart Editing platform, including its design, 
                code, logos, and trademarks, is owned by SmartSystem and protected by intellectual 
                property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Acceptable Use Policy</h2>
              <p className="text-muted-foreground mb-3">
                You may not use Smart Editing to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process illegal, harmful, or offensive content</li>
                <li>Create misleading or fraudulent materials</li>
                <li>Infringe on others' copyrights or trademarks</li>
                <li>Distribute malware or other malicious software</li>
                <li>Overload or abuse our servers and resources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Disclaimers</h2>
              <p className="text-muted-foreground">
                <strong>No Warranty:</strong> Smart Editing is provided "as is" without warranties 
                of any kind, whether express or implied, including but not limited to implied 
                warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Quality:</strong> While we strive for high-quality results, we cannot 
                guarantee that all processing will meet your expectations or be error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, SmartSystem shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including but 
                not limited to loss of profits, data, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                <li>Use or inability to use the service</li>
                <li>Any errors or omissions in the service</li>
                <li>Unauthorized access to your data</li>
                <li>Any third-party conduct on the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Service Modifications</h2>
              <p className="text-muted-foreground">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                <li>Modify or discontinue any part of the service at any time</li>
                <li>Change features, functionality, or pricing</li>
                <li>Update these terms without prior notice</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your access to Smart Editing immediately, without 
                prior notice, for any reason, including breach of these Terms. Upon termination, 
                your right to use the service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with applicable laws, 
                without regard to conflict of law principles. Any disputes arising from these 
                Terms shall be resolved in the appropriate courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable or invalid, that 
                provision shall be limited or eliminated to the minimum extent necessary, and 
                the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground mt-3">
                Email: legal@editing.biz.id
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
