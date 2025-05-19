
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


interface NavItem {
  href: string
  label: string;
  iconPath: string;
}

interface SidebarNavLinksProps {
  navItems: NavItem[];
  // currentPathname: string; // 
}

export default function SidebarNavLinks({ navItems }: SidebarNavLinksProps) {
  return (
    <nav className="flex-grow">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={"flex items-center space-x-3 p-2.5 rounded-lg transition-colors"} // Tu clase original
            >
              <Image
                src={item.iconPath}
                alt={item.label} 
                width={24}
                height={24}
              />
              <span className='text.md font-500 text-[#1D1E41]'>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}