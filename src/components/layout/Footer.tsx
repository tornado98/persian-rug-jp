// src/components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-primary-100 mt-20 border-t border-primary-700">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand & description */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Persian Rug JP</h3>
          <p className="text-primary-300 text-sm leading-relaxed">
            イラン直輸入の最高級手織りペルシャ絨毯を、
            <br />
            日本の皆さまへお届けします。
          </p>
        </div>

        {/* Helpful links */}
        <div>
          <h4 className="text-white font-semibold mb-3">サポート</h4>
          <ul className="space-y-2 text-sm text-primary-300">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                私たちについて
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                よくあるご質問
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                お問い合わせ
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal pages */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            特定商取引法に基づく表記
          </h4>
          <ul className="space-y-2 text-sm text-primary-300">
            <li>
              <Link
                href="/policy/trade-law"
                className="hover:text-white transition-colors"
              >
                特定商取引法
              </Link>
            </li>
            <li>
              <Link
                href="/policy/privacy"
                className="hover:text-white transition-colors"
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link
                href="/policy/terms"
                className="hover:text-white transition-colors"
              >
                利用規約
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-700 py-4 text-center text-sm text-primary-400">
        © {new Date().getFullYear()} Persian Rug JP. All rights reserved.
      </div>
    </footer>
  );
}
