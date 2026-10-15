import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export default function RiskBadge({ level, size = 'md' }) {
  const config = {
    danger: {
      icon: AlertTriangle,
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      label: 'Yüksek Risk',
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'Dikkat',
    },
    safe: {
      icon: CheckCircle,
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      label: 'Güvenli',
    },
  };

  const { icon: Icon, bg, text, border, label } = config[level] || config.safe;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 ${bg} ${text} ${border} border ${sizeClasses} rounded-full font-medium`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
    </span>
  );
}