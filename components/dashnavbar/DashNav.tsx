"use client"

import { BookOpen, ChartColumnBig, Folder, FolderOpen, LayoutDashboard, LogOut, Settings, User, Users } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashNav() {
    const { data: session, status } = useSession();
    return (
        <div className='h-full w-64 border bg-white flex flex-col justify-between p-3 select-none'>
            <div className='flex flex-col gap-1.5 text-sm'>
                
                <div className='p-2 mb-2 border-b border-slate-100'>
                    <div className='font-semibold text-slate-800 text-center'>Log Management</div>
                </div>

                {/* <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all font-medium'>
                    <LayoutDashboard size={16} />
                    <div className='mt-0.5'>Dashboard</div>
                </div> */}

                <Link className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all font-medium' href="/dashboard">
                    <LayoutDashboard size={16} />
                    <div className='mt-0.5'>Dashboard</div>
                </Link>

                {/* <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all'>
                    <ChartColumnBig size={16} />
                    <div className='mt-0.5'>Analysis</div>
                </div> */}

                {/* <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all'>
                    <FolderOpen size={16} />
                    <div className='mt-0.5'>Logs</div>
                </div> */}

                <Link className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all font-medium' href="/logs">
                    <Folder size={16} />
                    <div className='mt-0.5'>Logs</div>
                </Link>

                {/* <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all'>
                    <User size={16} />
                    <div className='mt-0.5'>Users</div>
                </div>
                <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all'>
                    <FolderOpen size={16} />
                    <div className='mt-0.5'>Tenants</div>
                </div>
                <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all'>
                    <Users size={16} />
                    <div className='mt-0.5'>Memberships</div>
                </div>
                <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all'>
                    <Settings size={16} />
                    <div className='mt-0.5'>Settings</div>
                </div> */}
            </div>

            <div className='border-t border-slate-100 pt-3'>
                <div className='flex items-center justify-between p-2 rounded-lg hover:bg-black/5 cursor-pointer transition-all'>
                    <div className='flex items-center gap-2.5'>
                        <div className='h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700 text-xs'>
                            C
                        </div>
                        <div>
                            <div className='text-xs font-medium text-slate-800'>{session?.user.username}</div>
                            <div className='text-[10px] text-slate-400'>{session?.user.email}</div>
                        </div>
                    </div>
                    <LogOut onClick={() => signOut()} size={16} className='text-slate-400 hover:text-rose-600 transition-colors' />
                </div>
            </div>
        </div>
    )
}