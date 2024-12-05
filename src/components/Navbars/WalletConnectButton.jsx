'use client';
import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletConnectButton() {
    const { connect, connectors, error, isPending } = useConnect();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const handleConnect = () => {
        // Open wallet connection modal or connect to the first available connector
        connect({
            connector: connectors[0]
        });
    };

    if (isConnected) {
        return (
            <div className='max-w-xl'>
                <button
                    className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-4"
                    onClick={() => disconnect()}
                >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>
            </div>

        );
    }

    return (
        <button
            className={`rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mr-4 type="button ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleConnect}
            disabled={isPending}
        >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
}