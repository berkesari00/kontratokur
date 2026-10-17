import { Loader2, Search, FileCheck, Shield } from 'lucide-react';
import useStore from '../store/useStore';

export default function LoadingOverlay() {
  const { analysisProgress } = useStore();

  const steps = [
    { icon: Search, label: 'Splitting document', threshold: 0 },
    { icon: Shield, label: 'Detecting risks', threshold: 25 },
    { icon: FileCheck, label: 'Generating report', threshold: 75 },
  ];

  const currentStepIndex = steps.reduce((acc, step, index) => {
    return analysisProgress >= step.threshold ? index : acc;
  }, 0);

  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-legal-500 rounded-2xl animate-pulse-slow opacity-20"></div>
          <div className="absolute inset-2 bg-legal-600 rounded-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analyzing Your Contract
        </h3>
        <p className="text-gray-500 dark:text-slate-400 mb-8">
          AI is reviewing your document clause by clause...
        </p>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isDone = index < currentStepIndex;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-legal-50 dark:bg-legal-900/30 scale-105' : isDone ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-slate-800/50 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDone ? 'bg-green-500' : isActive ? 'bg-legal-600' : 'bg-gray-300 dark:bg-slate-600'
                }`}>
                  {isDone ? <FileCheck className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 text-white ${isActive ? 'animate-pulse' : ''}`} />}
                </div>
                <span className={`text-sm font-medium ${
                  isDone ? 'text-green-700 dark:text-green-300' : isActive ? 'text-legal-700 dark:text-legal-300' : 'text-gray-400 dark:text-slate-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-legal-500 to-legal-700 rounded-full transition-all duration-500 ease-out" style={{ width: `${analysisProgress}%` }}></div>
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">{analysisProgress}%</p>
      </div>
    </div>
  );
}