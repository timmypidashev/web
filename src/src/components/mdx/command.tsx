import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
// Import all required icons from react-icons
import { FaDebian, FaFedora } from 'react-icons/fa6';
import { SiGentoo, SiNixos, SiArchlinux } from 'react-icons/si';

const Commands = ({ 
  commandId, 
  description,
  archCommand,
  debianCommand,
  fedoraCommand,
  gentooCommand,
  nixCommand
}) => {
  const [activeTab, setActiveTab] = useState('arch');
  const [copied, setCopied] = useState(false);

  const distros = [
    { 
      id: 'arch', 
      name: 'Arch',
      icon: SiArchlinux,
      command: archCommand || 'echo "No command specified for Arch"'
    },
    { 
      id: 'debian', 
      name: 'Debian',
      icon: FaDebian,
      command: debianCommand || 'echo "No command specified for Debian"'
    },
    { 
      id: 'fedora', 
      name: 'Fedora',
      icon: FaFedora,
      command: fedoraCommand || 'echo "No command specified for Fedora"'
    },
    { 
      id: 'gentoo', 
      name: 'Gentoo',
      icon: SiGentoo,
      command: gentooCommand || 'echo "No command specified for Gentoo"'
    },
    { 
      id: 'nix', 
      name: 'NixOS',
      icon: SiNixos,
      command: nixCommand || 'echo "No command specified for NixOS"'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="w-full rounded-md overflow-hidden border border-foreground/20 bg-background my-4">
      {/* Header with Terminal Icon and Copy Button */}
      <div className="bg-background border-b border-foreground/20 text-foreground p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Terminal size={20} className="mr-2 text-yellow-bright" />
          <div className="text-sm font-comic-code">
            {description || "Terminal Command"}
          </div>
        </div>
        <button 
          onClick={() => copyToClipboard(distros.find(d => d.id === activeTab).command)}
          className="bg-background hover:bg-foreground/10 text-foreground text-xs px-2 py-1 rounded flex items-center"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-1 text-green-bright" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1 text-foreground/70" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-foreground/20 bg-background">
        {distros.map((distro) => {
          const IconComponent = distro.icon;
          
          return (
            <button
              key={distro.id}
              className={`px-3 py-2 text-sm font-medium flex items-center ${
                activeTab === distro.id
                  ? 'bg-background border-b-2 border-blue-bright text-blue-bright'
                  : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
              }`}
              onClick={() => setActiveTab(distro.id)}
            >
              <span className="mr-1 inline-flex items-center">
                <IconComponent size={16} />
              </span>
              {distro.name}
            </button>
          );
        })}
      </div>
      
      {/* Command Display with Horizontal Scrolling */}
      <div className="bg-[#282828] text-foreground p-3 overflow-x-auto">
        <div className="flex items-center font-comic-code text-sm whitespace-nowrap">
          <span className="text-orange-bright mr-2">$</span>
          <span className="text-purple-bright">
            {distros.find(d => d.id === activeTab).command}
          </span>
        </div>
      </div>
    </div>
  );
};

// Also include a simpler command component for single commands
const Command = ({ 
  command, 
  description, 
  shell = "bash" 
}) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(command)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="w-full rounded-md overflow-hidden border border-foreground/20 bg-background my-4">
      {/* Header with Terminal Icon and Copy Button */}
      <div className="bg-background border-b border-foreground/20 text-foreground p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Terminal size={20} className="mr-2 text-yellow-bright" />
          <div className="text-sm font-comic-code">
            {description || "Terminal Command"}
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className="bg-background hover:bg-foreground/10 text-foreground text-xs px-2 py-1 rounded flex items-center"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-1 text-green-bright" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1 text-foreground/70" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Command Display with Horizontal Scrolling */}
      <div className="bg-[#282828] text-foreground p-3 overflow-x-auto">
        <div className="flex items-center font-comic-code text-sm whitespace-nowrap">
          <span className="text-orange-bright mr-2">$</span>
          <span className="text-purple-bright">
            {command}
          </span>
        </div>
      </div>
    </div>
  );
};

export { Commands, Command };
