export default async function handler(req, res) {
  const username = req.query.username;

  try {
    const userRes = await fetch("https://users.roproxy.com/v1/usernames/users", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: true
      })
    });

    const userData = await userRes.json();
    const id = userData.data?.[0]?.id;

    if (!id) return res.json({error: "User not found"});

    const groupRes = await fetch(`https://groups.roproxy.com/v2/users/${id}/groups/roles`);
    const groupData = await groupRes.json();

    const groups = groupData.data
      .map(g => `${g.group.name} - ${g.role.name}`)
      .join(" | ");

    res.json({
      username,
      id,
      groups: groups || "No groups"
    });

  } catch (e) {
    res.json({error: "API error"});
  }
}