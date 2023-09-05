import React, { useState, useEffect } from 'react';
import objectHash from 'object-hash';

import SettingTile from '../../../../molecules/setting-tile/SettingTile';
import Toggle from '../../../../atoms/button/Toggle';
import { toggleActionLocal } from '../../Api';
import { getWeb3Cfg, deleteWeb3Cfg, setWeb3Cfg } from '../../../../../util/web3';
import Web3Item from './Web3Item';
import { tinyConfirm, tinyPrompt } from '../../../../../util/tools';

function Web3Section() {

    // Prepare React
    const web3Settings = getWeb3Cfg();
    const [networks, setNetworks] = useState({ keys: [], values: [] });
    const [web3Enabled, setWeb3Enabled] = useState(web3Settings.web3Enabled);

    useEffect(() => {

        const newWeb3Settings = getWeb3Cfg();

        const newNetworks = { keys: [], values: [] };
        for (const item in newWeb3Settings.networks) {
            newNetworks.values.push(newWeb3Settings.networks[item]);
            newNetworks.keys.push(item);
        }

        newNetworks.keys.sort((a, b) => newWeb3Settings.networks[a].chainIdInt - newWeb3Settings.networks[b].chainIdInt);
        newNetworks.values.sort((a, b) => a.chainIdInt - b.chainIdInt);

        if (objectHash(newNetworks) !== objectHash(networks)) setNetworks(newNetworks);

    });

    // Complete Render
    return <>

        <div className="card noselect mb-3">
            <ul className="list-group list-group-flush">

                <li className="list-group-item very-small text-gray">Main Settings</li>

                <SettingTile
                    title="Enabled"
                    options={(
                        <Toggle
                            className='d-inline-flex'
                            isActive={web3Enabled}
                            onToggle={toggleActionLocal('ponyHouse-web3', 'web3Enabled', setWeb3Enabled)}
                        />
                    )}
                    content={<div className="very-small text-gray">All Pony House web3 features require this setting enabled. If you disable this option, everything related to web3 will be limited to native Pony House features only.</div>}
                />

                <li className="list-group-item very-small text-gray">

                    <button type="button" class="btn btn-sm btn-danger me-3 my-1 my-sm-0" onClick={async () => {
                        const isConfirmed = await tinyConfirm('Are you sure you want to reset this? All your data will be lost forever!', 'Reset web3 config');
                        if (isConfirmed) {
                            deleteWeb3Cfg('networks');
                            setNetworks({ keys: [], values: [] });
                        }
                    }}>Reset config</button>

                    <button type="button" class="btn btn-sm btn-success me-3 my-1 my-sm-0" onClick={async () => {
                        const newNetwork = await tinyPrompt('Choose an Object Id for your new network', 'New web3 network', 'ethereum');
                        if (typeof newNetwork === 'string' && newNetwork.length > 0) {

                            const newWeb3Settings = getWeb3Cfg();
                            newWeb3Settings.networks[newNetwork] = { chainName: newNetwork };
                            setWeb3Cfg('networks', newWeb3Settings.networks);
                            setNetworks({ keys: [], values: [] });

                        }
                    }}>Create</button>

                    <button type="button" class="btn btn-sm btn-secondary me-3 my-1 my-sm-0" onClick={() => {

                    }}>Export</button>

                    <button type="button" class="btn btn-sm btn-secondary my-1 my-sm-0" onClick={() => {

                    }}>Import</button>

                </li>

                <li className="list-group-item very-small text-gray">
                    For the settings to take effect, please restart the app.
                </li>

            </ul>
        </div>

        {networks.values.map((item, index) => <Web3Item item={item} networkId={networks.keys[index]} />)}

    </>;

};

export default Web3Section;