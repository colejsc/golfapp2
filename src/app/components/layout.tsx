// 'use client' 
// import type { ReactNode } from "react"
// // import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Header from "./header"
// // import { Inter } from '@next/font/google'
// import { Spin } from "antd";

// // const inter = Inter({ subsets: ['latin'] });

// export default function Layout({ children }: { children: ReactNode }) {
//     // const { status: sessionStatus } = useSession();
//     const router = useRouter();

//     // if (sessionStatus === 'unauthenticated' && router.pathname !== '/' && router.pathname !== '/log-viewer') {
//     //     router.replace('/');
//     //     return (<div className="mainContent"><Header /><div className="pageContent center"><Spin size="large" /></div></div>)
//     // }

//     return (
//         <div className={' mainContent'}>
//             <Header />
//             <div className="pageContent">
//                 {children}
//             </div>
//         </div>
//     )
// }
