
import React from 'react';
import { btModal, objType } from '../../../src/util/tools';

import initMatrix from '../../../src/client/initMatrix';

import jReact from '../../lib/jReact';
import RawIcon from '../../../src/app/atoms/system-icons/RawIcon';

import defaultAvatar from '../../../src/app/atoms/avatar/defaultAvatar';

// import * as roomActions from '../../../src/client/action/room';
// import { getSelectRoom } from '../../../src/util/selectedRoom';
import { serverAddress, serverDomain } from '../socket';
import { setLoadingPage } from '../../../src/app/templates/client/Loading';
import { selectRoom, selectRoomMode, selectTab } from '../../../src/client/action/navigation';
import { join } from '../../../src/client/action/room';

const openRoom = (roomId) => {

    const mx = initMatrix.matrixClient;
    const room = mx.getRoom(roomId);

    if (!room) return;
    if (room.isSpaceRoom()) selectTab(roomId);

    else {
        selectRoomMode('room');
        selectRoom(roomId);
    }

};

const createButton = (id, title, icon) => jReact(
    <button
        className={['sidebar-avatar', 'position-relative'].join(' ')}
        title={title}
        id={`agi-${id}`}
        type="button"
    >
        <div className='avatar-container avatar-container__normal  noselect'>

            <span
                style={{ backgroundColor: 'transparent' }}
                className='avatar__border--active'
            >
                <RawIcon fa={icon} />
            </span>

        </div>
    </button>
);

export function addRoomOptions(dt, roomType) {

    // Room Options list
    const roomOptions = $('#room-options');

    // Add Special Button
    let botsMenu = roomOptions.find('#agi-bots-menu').remove();
    if (roomType === 'room') {

        // Prepare Button
        botsMenu = jReact(
            <li className='nav-item' id='agi-bots-menu' >
                <button
                    title='Add AI'
                    className={['btn', 'ic-btn', 'ic-btn-link', 'btn-bg', 'btn-link', 'btn-bg', 'btn-text-link', 'btn-bg', 'nav-link', 'border-0'].join(' ')}
                    tabIndex={0}
                    type="button"
                >
                    <RawIcon fa='bi bi-lightbulb-fill' />
                </button>
            </li>
        );

        // User Test (TESTING MODE)
        const userGenerator = (username, nickname, avatar) => $('<div>', { class: 'room-tile' }).append(

            $('<div>', { class: 'room-tile__avatar' }).append(
                $('<div>', { class: 'avatar-container avatar-container__normal  noselect' }).append(
                    $('<img>', { class: 'avatar-react img-fluid', draggable: false, src: avatar, alt: nickname }).css('background-color', 'transparent')
                )
            ),

            $('<div>', { class: 'room-tile__content emoji-size-fix' }).append(
                $('<h4>', { class: 'text text-s1 text-normal' }).text(nickname),
                $('<div>', { class: 'very-small text-gray' }).text(username)
            ),

            $('<div>', { class: 'room-tile__options' }).append(
                $('<button>', { class: 'btn btn-primary btn-sm noselect', type: 'button' }).data('pony-house-username', username).text('Invite').on('click', async (event) => {

                    /*

                    const userId = $(event.target).data('pony-house-username');
                    const roomId = getSelectRoom()?.roomId;

                    roomActions.invite(roomId, userId).catch(err => {
                        console.error(err);
                        alert(err.message);
                    });

                    */

                    setLoadingPage('Looking for address...');
                    const alias = $(event.target).data('pony-house-username');
                    const mx = initMatrix.matrixClient;
                    setLoadingPage('Looking for address...');
                    let via;
                    if (alias.startsWith('#')) {
                        try {
                            const aliasData = await mx.getRoomIdForAlias(alias);
                            via = aliasData?.servers.slice(0, 3) || [];
                            setLoadingPage(`Joining ${alias}...`);
                        } catch (err) {
                            setLoadingPage(false);
                            console.error(err);
                            alert(`Unable to find room/space with ${alias}. Either room/space is private or doesn't exist.`);
                        }
                    }
                    try {
                        const roomId = await join(alias, false, via);
                        openRoom(roomId);
                        setLoadingPage(false);
                    } catch {
                        setLoadingPage(false);
                        alert(`Unable to join ${alias}. Either room/space is private or doesn't exist.`);
                    }

                })
            )

        );

        // Bot List button
        botsMenu.find('> button').tooltip({ placement: 'bottom' }).on('click', () => {

            setLoadingPage();
            const mx = initMatrix.matrixClient;

            fetch(`${serverAddress}list/${mx.getUserId()}`, {
                headers: {
                    'Accept': 'application/json'
                }
            }).then(res => res.json()).then(data => {
                if (Array.isArray(data)) {

                    // Prepare to read data
                    setLoadingPage(false);
                    const users = [];
                    for (const item in data) {
                        if (objType(data[item], 'object')) {

                            // Get Users
                            try {

                                /* const userId = !data[item].bot_username.startsWith('@') ? `@${data[item].bot_username}` : data[item].bot_username;
                                const user = mx.getUser(userId) ?? { userId, displayName: data[item].agent_name, avatarUrl: data[item].profile_photo };
                                if (objType(user, 'object')) {
                                    users.push(userGenerator(
                                        user.userId ?? userId,
                                        user.displayName ? user.displayName : user.userId ?? data[item].agent_name ? data[item].agent_name : user.userId,
                                        user.avatarUrl ? mx.mxcUrlToHttp(user.avatarUrl, 42, 42, 'crop') : data[item].profile_photo ? data[item].profile_photo : defaultAvatar(1),
                                    ));
                                } else {
                                    users.push(userGenerator(
                                        userId,
                                        data[item].agent_name ? data[item].agent_name : userId,
                                        data[item].profile_photo ? data[item].profile_photo : defaultAvatar(1)
                                    ));
                                } */

                                const userId = !data[item].bot_username.startsWith('#') ? `#${data[item].bot_username}` : data[item].bot_username;
                                users.push(userGenerator(
                                    userId,
                                    data[item].agent_name ? data[item].agent_name : userId,
                                    data[item].profile_photo ? data[item].profile_photo : defaultAvatar(1)
                                ));

                            }

                            // Error
                            catch (err) {
                                console.error(err);
                                users.push(userGenerator(data[item], data[item], defaultAvatar(1),));
                            }

                        }
                    }

                    // Empty
                    if (users.length < 1) {
                        users.push($('<center>', { class: 'small mt-3' }).text('No bots were found.'));
                    }

                    // Show List
                    btModal({

                        id: 'agi-bots-menu-modal',
                        dialog: 'modal-lg',
                        title: 'Add AI bot to the room',

                        body: $('<div>', { class: 'invite-user' }).append(
                            $('<div>', { class: 'small mb-3' }).text('List of available bots to be added'),
                            $('<div>', { class: 'invite-user__content' }).append(users)
                        )

                    });

                }
            }).catch(err => {
                setLoadingPage(false);
                console.error(err);
                alert(err.message);
            });
        });

        // Append
        roomOptions.prepend(botsMenu);

    }

};

export default function buttons() {

    // Space Container
    const spaceContainer = $('.space-container');


    // Superagent
    let superagent = spaceContainer.find('#agi-superagent');
    if (superagent.length > 0) {
        superagent.remove();
    }

    // Prepare Button
    superagent = createButton('superagent', 'SuperAgent', 'fa-solid fa-user-ninja');

    // Add Click

    superagent.tooltip({ placement: 'right' }).on('click', () => btModal({
        id: 'agi-superagent-modal',
        dialog: 'modal-fullscreen',
        title: 'SuperAgent',
        body: jReact(<iframe title='SuperAgent' src={`https://super.${serverDomain}`} className='w-100 height-modal-full-size' style={{ backgroundColor: '#000' }} />)
    }));

    // Append
    spaceContainer.append(superagent);

};
