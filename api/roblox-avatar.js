export async function GET(request) {
  const username = new URL(request.url).searchParams.get('username')?.trim() || '';
  if (!/^[a-z0-9_]{2,20}$/i.test(username)) {
    return Response.json({ error: 'Informe um usuário válido do Roblox.' }, { status: 400 });
  }

  try {
    const users = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
      signal: AbortSignal.timeout(5000)
    });
    if (!users.ok) throw new Error('Roblox indisponível');
    const account = (await users.json()).data?.[0];
    if (!account) return Response.json({ error: 'Usuário do Roblox não encontrado.' }, { status: 404 });

    const thumbnails = await fetch(
      'https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=' + account.id + '&size=150x150&format=Png&isCircular=false',
      { signal: AbortSignal.timeout(5000) }
    ).catch(() => null);
    const avatar = thumbnails?.ok ? (await thumbnails.json()).data?.[0]?.imageUrl : null;
    return Response.json({ username: account.name, avatar: avatar || null });
  } catch {
    return Response.json({ error: 'Não foi possível consultar o Roblox. Tente novamente.' }, { status: 502 });
  }
}
