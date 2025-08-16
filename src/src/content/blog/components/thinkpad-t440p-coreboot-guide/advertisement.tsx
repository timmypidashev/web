import React from 'react';

interface T440pAdProps {
  className?: string;
}

const Advertisement: React.FC<T440pAdProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-lg p-6 my-8 shadow-lg ${className}`}>
      <div className="flex items-start gap-4">
        {/* Icon/Logo placeholder */}
        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900">
              Custom Corebooted ThinkPad T440p
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Available Now
            </span>
          </div>

          <p className="text-gray-700 mb-4">
            Skip the technical complexity and get a professionally corebooted ThinkPad T440p 
            built to your specifications. Each laptop is carefully modified and tested to ensure 
            optimal performance and reliability.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✨ What's Included:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Coreboot firmware pre-installed</li>
                <li>• IPS 1080p display upgrade</li>
                <li>• RAM options: 4GB, 8GB, or 16GB</li>
                <li>• CPU choice available</li>
                <li>• Battery upgrade option</li>
                <li>• Thorough testing & quality assurance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔧 Benefits:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Faster boot times</li>
                <li>• Open-source BIOS</li>
                <li>• Enhanced security</li>
                <li>• No proprietary firmware</li>
                <li>• Full hardware control</li>
                <li>• Professional installation</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-blue-200">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">$500</span>
              <span className="text-sm text-gray-600">USD (base configuration)</span>
            </div>
            
            <div className="flex gap-3">
              <a 
                href="https://ebay.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.5 2A1.5 1.5 0 007 3.5v1A1.5 1.5 0 008.5 6h7A1.5 1.5 0 0017 4.5v-1A1.5 1.5 0 0015.5 2h-7zM10 3h4v1h-4V3z"/>
                  <path d="M6 7.5A1.5 1.5 0 017.5 6h9A1.5 1.5 0 0118 7.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 16.5v-9z"/>
                </svg>
                Order on eBay
              </a>
              
              <button className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
