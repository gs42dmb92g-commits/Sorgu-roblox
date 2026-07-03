const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/groups/:username", async (req, res) => {
    const username = req.params.username;

    try {
        const user = await fetch("https://users.roproxy.com/v1/usernames/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                usernames: [username],
                excludeBannedUsers: true
            })
        });

        const data = await user.json();
        const id = data.data?.[0]?.id;

        if (!id) return res.json({error: "User not found"});

        const groupsRes = await fetch(`https://groups.roproxy.com/v2/users/${id}/groups/roles`);
        const groupsData = await groupsRes.json();

        const groups = groupsData.data.map(g => ({
            name: g.group.name,
            role: g.role.name
        }));

        res.json({username, id, groups});

    } catch (e) {
        res.json({error: "API error"});
    }
});


app.listen(3000);
