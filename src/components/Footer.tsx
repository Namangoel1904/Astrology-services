"use client";

import { Sparkles, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-t border-purple-200 dark:border-purple-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ज्योतिष परामर्श
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              भारत की सबसे विश्वसनीय ज्योतिष परामर्श सेवा। हमारे अनुभवी ज्योतिषियों
              से जुड़ें और अपने जीवन की समस्याओं का समाधान पाएं।
            </p>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="font-semibold mb-4">त्वरित लिंक</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-purple-600 transition-colors">
                  होम
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  हमारे ज्योतिषी
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  सेवाएं
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 transition-colors">
                  हमारे बारे में
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">सेवाएं</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>वैदिक ज्योतिष</li>
              <li>कुंडली मिलान</li>
              <li>नुमेरोलॉजी</li>
              <li>टैरो कार्ड रीडिंग</li>
              <li>वास्तु परामर्श</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">संपर्क करें</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {/* <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li> */}
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>astrojyoti8@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>जलगांव, महाराष्ट्र, भारत</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-200 dark:border-purple-800 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 ज्योतिष परामर्श. सर्वाधिकार सुरक्षित।</p>
        </div>
      </div>
    </footer>
  );
}