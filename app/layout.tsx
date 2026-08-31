import "./globals.css";
import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {title:"峡谷进阶 · LOL 排位训练",description:"将每一局排位变成可持续的训练样本"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><div className="relative flex min-h-screen"><Sidebar/><main className="min-w-0 flex-1 pb-24 md:pb-8">{children}</main></div></body></html>}
