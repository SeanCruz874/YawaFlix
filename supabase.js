const SUPABASE_URL = 'https://gqooenkttlewrfernnwc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WZfGrTRRXQrVlidVWDDS3A_1YrjR9wr';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let realtimeSubscription = null;

window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        loadSidebarSubscriptions(session.user.id);
        checkUnreadNotifications(session.user.id);
        setupRealtimeNotifications(session.user.id);
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session) {
            loadSidebarSubscriptions(session.user.id);
            checkUnreadNotifications(session.user.id);
            setupRealtimeNotifications(session.user.id);
        } else {
            const listEl = document.getElementById('sidebar-subscriptions-list');
            if (listEl) {
                listEl.innerHTML = '<span style="font-size: 12px; color: #aaa;">Sign in to see subscriptions</span>';
            }
            const dot = document.getElementById('notification-dot');
            if (dot) dot.style.display = 'none';
        }
    });
});

async function loadSidebarSubscriptions(userId) {
    const listEl = document.getElementById('sidebar-subscriptions-list');
    if (!listEl) return;

    const { data: subs, error: subError } = await supabaseClient
        .from('subscriptions')
        .select('channel_id')
        .eq('subscriber_id', userId);

    if (subError || !subs || subs.length === 0) {
        listEl.innerHTML = '<span style="font-size: 12px; color: #aaa;">No subscriptions yet</span>';
        return;
    }

    const channelIds = subs.map(s => s.channel_id);

    const { data: profiles, error: profileError } = await supabaseClient
        .from('profiles')
        .select('id, username, handle, avatar_url')
        .in('id', channelIds);

    if (profileError || !profiles || profiles.length === 0) {
        listEl.innerHTML = '<span style="font-size: 12px; color: #aaa;">No subscriptions yet</span>';
        return;
    }

    listEl.innerHTML = '';
    profiles.forEach(profile => {
        const username = profile.username || 'Channel';
        const avatar = profile.avatar_url || '';

        const item = document.createElement('div');
        item.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; width: 45px; text-align: center;';
        item.onclick = () => {
            window.location.href = `index.html?channel=${profile.id}`;
        };

        item.innerHTML = `
            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #555; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                ${avatar ? `<img src="${avatar}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span style="font-size: 12px; font-weight: bold;">${username[0].toUpperCase()}</span>`}
            </div>
            <span style="font-size: 10px; color: #aaa; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">@${username}</span>
        `;
        listEl.appendChild(item);
    });
}

function executeSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

async function fetchSearchResults(keyword) {
    const { data: videos, error } = await supabaseClient
        .from('videos')
        .select('*')
        .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);

    if (error) {
        console.error("Search failed:", error);
    } else {
        if (typeof renderChannelVideos === 'function') {
            renderChannelVideos(videos);
        }
    }
}

async function checkUnreadNotifications(userId) {
    if (!userId) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) return;
        userId = session.user.id;
    }

    const { count, error } = await supabaseClient
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

    if (!error) {
        const dot = document.getElementById('notification-dot');
        if (dot) {
            dot.style.display = (count > 0) ? 'block' : 'none';
        }
    }
}

function setupRealtimeNotifications(userId) {
    if (realtimeSubscription) {
        supabaseClient.removeChannel(realtimeSubscription);
    }
    realtimeSubscription = supabaseClient.channel('public:notifications')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
            payload => {
                checkUnreadNotifications(userId);
                if (typeof loadNotifications === 'function') {
                    loadNotifications(userId);
                }
            }
        )
        .subscribe();
}