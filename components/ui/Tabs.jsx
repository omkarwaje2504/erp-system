import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext({
selectedTab: "",
setSelectedTab: () => {},
});

export function Tabs({ defaultValue, children, className = "" }) {
const [selectedTab, setSelectedTab] = useState(defaultValue);

return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
    <div className={`w-full ${className}`} data-orientation="horizontal">
        {children}
    </div>
    </TabsContext.Provider>
);
}

export function TabsList({ children, className = "" }) {
return (
    <div
    role="tablist"
    className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    aria-orientation="horizontal"
    >
    {children}
    </div>
);
}

export function TabsTrigger({ value, children, className = "" }) {
const { selectedTab, setSelectedTab } = useContext(TabsContext);
const isSelected = selectedTab === value;

return (
    <button
    type="button"
    role="tab"
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
    ${isSelected 
        ? "bg-white text-gray-900 shadow-sm" 
        : "text-gray-500 hover:text-gray-900"} 
    ${className}`}
    aria-selected={isSelected}
    data-state={isSelected ? "active" : "inactive"}
    onClick={() => setSelectedTab(value)}
    >
    {children}
    </button>
);
}

export function TabsContent({ value, children, className = "" }) {
const { selectedTab } = useContext(TabsContext);
const isSelected = selectedTab === value;

if (!isSelected) return null;

return (
    <div
    role="tabpanel"
    className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}
    data-state={isSelected ? "active" : "inactive"}
    tabIndex={0}
    >
    {children}
    </div>
);
}

