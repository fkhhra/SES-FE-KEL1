self.addEventListener('push', (event) => {
    let data = {};
    try { data = event.data.json(); } catch {}
    const title = data.title || 'Notifikasi';
    const body = data.body || '';
    const url = data.url || '/';
    const options = { body, icon: '/img/favicon-192.png', data: { url } };
    // Tampilkan notifikasi dan kirim pesan ke semua client agar UI in-page update (banner merah)
    event.waitUntil(
      Promise.all([
        self.registration.showNotification(title, options),
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
          list.forEach(c => c.postMessage({ type: 'LOSTFOUND_NEW', payload: data }))
        })
      ])
    );
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) { client.navigate(url); return client.focus(); }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
    );
  });