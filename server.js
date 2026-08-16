const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();
const topics = ['html','css','javascript','node.js'];
const projects = ['mini portfolio','quiz machine','pixel canvas','classroom api','mood page','idea vault'];
const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'Debugging: being the detective in a crime movie where you are also the murderer.',
  'A SQL query walks into a bar, walks up to two tables and asks, "Can I join you?"'
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (req, res) => res.json({
  status: 'online',
  node: process.version,
  port: PORT,
  uptime: Math.floor((Date.now() - startedAt) / 1000),
  time: new Date().toLocaleTimeString()
}));

app.get('/api/resources', (req, res) => res.json({topics, count: topics.length}));
app.get('/api/projects', (req, res) => res.json({projects, count: projects.length}));
app.get('/api/health', (req, res) => res.json({ok: true, message: 'sajida coding space is healthy'}));

app.post('/api/terminal', (req, res) => {
  const command = String(req.body.command || '').trim();
  const lower = command.toLowerCase();
  const responses = {
    help: `available commands:\n\nhelp         show available commands\nstatus       check the node.js server\ntime         show the current time\nhello        say hello to sajida\nabout        show website information\nwhoami       show the current user\nresources    list classroom topics and links\nprojects     list starter project ideas\njoke         tell a quick programming joke\nhealth       run a health check\nclear        clear the terminal`,
    status: `server: ONLINE\nnode.js: ${process.version}\nport: ${PORT}\nuptime: ${Math.floor((Date.now() - startedAt) / 1000)} seconds`,
    time: `current time: ${new Date().toLocaleTimeString()}`,
    hello: "hello sajida! ♡",
    about: "sajida's coding space — an interactive learning dashboard built with node.js, html, css, and javascript.",
    whoami: 'student@the-classroom',
    resources: `resources available:\n- html       web structure, elements, forms\n- css        visual design, layout, animation\n- javascript interactivity, events, fetch, dom\n- node.js    backend, servers, api routes\n\nopen the resources section for official documentation links.`,
    projects: `starter projects:\n${projects.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
    joke: jokes[Math.floor(Math.random() * jokes.length)],
    health: 'health check: OK — express is responding.'
  };
  if (lower === 'clear') return res.json({output: '__CLEAR__'});
  res.json({output: responses[lower] ?? `command not found: ${command}\n\ntype "help" to see available commands.`});
});

app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`sajida's coding space is running at http://localhost:${PORT}`));
