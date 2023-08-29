import React, { useState, useEffect, useRef } from 'react';
import SettingTile from '../../../molecules/setting-tile/SettingTile';
import Toggle from '../../../atoms/button/Toggle';
import { toggleActionLocal } from '../Api';

function IpfsSection() {

    // Prepare React
    const ipfsSettings = toggleActionLocal('ponyHouse-ipfs')();
    const [ipfsDisabled, setIpfsDisabled] = useState(ipfsSettings.ipfsDisabled);

    const publicGatewayRef = useRef(null);
    const subdomainPublicGatewayRef = useRef(null);
    const apiIpfsRef = useRef(null);
    const localGatewayRef = useRef(null);

    // Effects
    useEffect(() => {

        // Template
        const clickGenerator = (where, item) => {
            const tinyAction = toggleActionLocal('ponyHouse-ipfs', where, null);
            return () => {
                const value = item.val();
                tinyAction(typeof value === 'string' && value.length > 0 ? value : undefined);
            };
        };

        // jQuery
        const htmlPublicGateway = $(publicGatewayRef.current);
        const htmlSubdomainPublicGateway = $(subdomainPublicGatewayRef.current);
        const htmlApiIpfs = $(apiIpfsRef.current);
        const htmlLocalGateway = $(localGatewayRef.current);

        // Function
        const clickPublicGateway = clickGenerator('publicGateway', htmlPublicGateway);
        const clickSubdomainPublicGateway = clickGenerator('subdomainPublicGateway', htmlSubdomainPublicGateway);
        const clickApiIpfs = clickGenerator('apiIpfs', htmlApiIpfs);
        const clickLocalGateway = clickGenerator('localGateway', htmlLocalGateway);

        // Events
        htmlPublicGateway.val(typeof ipfsSettings.publicGateway === 'string' && ipfsSettings.publicGateway.length > 0 ? ipfsSettings.publicGateway : 'https://ipfs.io/').on('change', clickPublicGateway);
        htmlSubdomainPublicGateway.val(typeof ipfsSettings.subdomainPublicGateway === 'string' && ipfsSettings.subdomainPublicGateway.length > 0 ? ipfsSettings.subdomainPublicGateway : 'https://dweb.link/').on('change', clickSubdomainPublicGateway);
        htmlApiIpfs.val(typeof ipfsSettings.apiIpfs === 'string' && ipfsSettings.apiIpfs.length > 0 ? ipfsSettings.apiIpfs : 'http://127.0.0.1:5001/').on('change', clickApiIpfs);
        htmlLocalGateway.val(typeof ipfsSettings.localGateway === 'string' && ipfsSettings.localGateway.length > 0 ? ipfsSettings.localGateway : 'http://localhost:8080/').on('change', clickLocalGateway);

        // Complete
        return () => {
            htmlPublicGateway.off('change', clickPublicGateway);
            htmlSubdomainPublicGateway.off('change', clickSubdomainPublicGateway);
            htmlApiIpfs.off('change', clickApiIpfs);
            htmlLocalGateway.off('change', clickLocalGateway);
        };

    });

    // Complete Render
    return (<>

        <div className="card noselect mb-3">
            <ul className="list-group list-group-flush">

                <li className="list-group-item very-small text-gray">Main Settings</li>

                <SettingTile
                    title="Disabled"
                    options={(
                        <Toggle
                            className='d-inline-flex'
                            isActive={ipfsDisabled}
                            onToggle={toggleActionLocal('ponyHouse-ipfs', 'ipfsDisabled', setIpfsDisabled)}
                        />
                    )}
                    content={<div className="very-small text-gray">Disable ipfs protocol compatibility. (This will not disable IPFS urls format)</div>}
                />

            </ul>
        </div>

        <div className="card noselect mb-3">
            <ul className="list-group list-group-flush">

                <li className="list-group-item very-small text-gray">Gateway</li>

                <li className="list-group-item border-0">

                    <div class="mb-3">
                        <label for="publicGateway" class="form-label small">Public Gateway</label>
                        <input ref={publicGatewayRef} type="text" class="form-control form-control-bg" id="publicGateway" placeholder="https://ipfs.io/" />
                        <div className="very-small text-gray">This value will be used for public gateways.</div>
                    </div>

                    <div class="mb-3">
                        <label for="subdomainPublicGateway" class="form-label small">Public Subdomain Gateway</label>
                        <input ref={subdomainPublicGatewayRef} type="text" class="form-control form-control-bg" id="subdomainPublicGateway" placeholder="https://dweb.link/" />
                        <div className="very-small text-gray">This value will be used for public subdomain gateways.</div>
                    </div>

                    <div class="mb-3">
                        <label for="localGateway" class="form-label small">Local Gateway</label>
                        <input ref={localGatewayRef} type="text" class="form-control form-control-bg" id="localGateway" placeholder="http://localhost:8080/" />
                        <div className="very-small text-gray">Set the URL of your local gateway.</div>
                    </div>

                </li>

            </ul>
        </div>

        <div className="card noselect mb-3">
            <ul className="list-group list-group-flush">

                <li className="list-group-item very-small text-gray">API</li>

                <li className="list-group-item border-0">

                    <div class="mb-3">
                        <label for="apiIpfs" class="form-label small">API Urls</label>
                        <input ref={apiIpfsRef} type="text" class="form-control form-control-bg" id="apiIpfs" placeholder="http://127.0.0.1:5001/" />
                        <div className="very-small text-gray">Set the URL of your IPFS API. (Hint: this is where /api/v0/config lives.)</div>
                    </div>

                </li>

            </ul>
        </div>

    </>
    );

};

export default IpfsSection;