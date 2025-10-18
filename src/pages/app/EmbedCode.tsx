import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmbedCode = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const embedCode = `<!-- MintChat Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['MintChat']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'mc', 'https://cdn.mintchat.ai/widget.js'));
  mc('init', 'YOUR_BOT_ID');
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const checklist = [
    { id: 1, text: 'Train your assistant with knowledge materials', done: true },
    { id: 2, text: 'Customize the appearance and branding', done: true },
    { id: 3, text: 'Copy the embed code below', done: false },
    { id: 4, text: 'Paste it before the closing </body> tag', done: false },
    { id: 5, text: 'Test your widget on your website', done: false },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Embed Code</h1>
          <p className="text-sm text-gray-600">Add MintChat to your website</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Checklist */}
          <div className="enterprise-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Checklist</h2>
            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      item.done
                        ? 'bg-mint-600 border-mint-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-sm ${
                      item.done ? 'text-gray-600 line-through' : 'text-gray-900'
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Embed Code */}
          <div className="enterprise-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Embed Code</h2>
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100 font-mono">
                <code>{embedCode}</code>
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Replace <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">YOUR_BOT_ID</code> with your actual bot ID
            </p>
          </div>

          {/* Demo Link */}
          <div className="enterprise-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Preview Your Widget</h2>
            <p className="text-gray-600 mb-4">
              See how your chat widget will look on a real website
            </p>
            <Button asChild className="bg-mint-600 hover:bg-mint-700 text-white">
              <Link to="/demo">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Demo Page
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmbedCode;