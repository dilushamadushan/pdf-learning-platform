import { Brain, FileQuestion, FileText, MessageSquare } from 'lucide-react';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'quiz', label: 'Quiz', icon: FileQuestion },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  return (
    <div className="glass-card p-2 flex gap-2 overflow-x-auto scrollbar-hide">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              tab-button flex items-center gap-2 whitespace-nowrap
              ${isActive ? 'tab-active' : 'tab-inactive'}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-accent-primary' : ''}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
