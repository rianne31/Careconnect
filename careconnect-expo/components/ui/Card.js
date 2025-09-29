import React from 'react';
import { View } from 'react-native';

export default function Card({ children, className = '' }) {
  const base = 'rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-5';
  return <View className={`${base} ${className}`}>{children}</View>;
}


