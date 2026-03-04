document.addEventListener('DOMContentLoaded', () => {
    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

// --- D3.js Skill Graph (Obsidian Style) ---
function initSkillGraph() {
    const container = document.getElementById('skill-graph');
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Colors
    const colors = {
        clinical: '#60a5fa', // blue-400
        technical: '#4ade80', // green-400
        operational: '#fbbf24' // amber-400
    };

    // Hub nodes definition
    const hubs = ["Python", "PA Operations", "Workflow Translation", "RAG / AI Agents", "Clinical Policy"];

    // Data
    const data = {
        nodes: [
            // Clinical (scaled down)
            { id: "RN License", group: "clinical", baseRadius: 3.5 },
            { id: "PA Operations", group: "clinical", baseRadius: 6.5 },
            { id: "UM Review", group: "clinical", baseRadius: 3.5 },
            { id: "Clinical Policy", group: "clinical", baseRadius: 6.5 },
            { id: "MCO Workflows", group: "clinical", baseRadius: 4.5 },
            { id: "CMS Regs", group: "clinical", baseRadius: 3.5 },
            // Technical
            { id: "Python", group: "technical", baseRadius: 6.5 },
            { id: "Flask", group: "technical", baseRadius: 3.5 },
            { id: "RAG / AI Agents", group: "technical", baseRadius: 7 },
            { id: "Prompt Eng", group: "technical", baseRadius: 4.5 },
            { id: "RPA / Automation", group: "technical", baseRadius: 5.5 },
            { id: "Data Viz", group: "technical", baseRadius: 4 },
            // Operational
            { id: "Team Supervision", group: "operational", baseRadius: 5.5 },
            { id: "Process Design", group: "operational", baseRadius: 4.5 },
            { id: "SLA Management", group: "operational", baseRadius: 3.5 },
            { id: "Workflow Translation", group: "operational", baseRadius: 6.5 },
            { id: "Training Dev", group: "operational", baseRadius: 4 }
        ],
        links: [
            // Clinical internal
            { source: "PA Operations", target: "Clinical Policy", value: 1 },
            { source: "PA Operations", target: "MCO Workflows", value: 1 },
            { source: "UM Review", target: "CMS Regs", value: 1 },
            { source: "RN License", target: "UM Review", value: 1 },

            // Technical internal
            { source: "Python", target: "RPA / Automation", value: 1 },
            { source: "Python", target: "Flask", value: 1 },
            { source: "Python", target: "Data Viz", value: 1 },
            { source: "RAG / AI Agents", target: "Prompt Eng", value: 1 },
            { source: "RAG / AI Agents", target: "Python", value: 1 },

            // Operational internal
            { source: "Team Supervision", target: "Process Design", value: 1 },
            { source: "Process Design", target: "Workflow Translation", value: 1 },
            { source: "Team Supervision", target: "SLA Management", value: 1 },
            { source: "Training Dev", target: "Process Design", value: 1 },

            // NEW: Cross-cluster connections to eliminate orphans
            { source: "RN License", target: "PA Operations", value: 1 },
            { source: "RN License", target: "Clinical Policy", value: 1 },
            { source: "CMS Regs", target: "PA Operations", value: 1 },
            { source: "CMS Regs", target: "Workflow Translation", value: 1 },
            { source: "UM Review", target: "PA Operations", value: 1 },
            { source: "UM Review", target: "RAG / AI Agents", value: 1 },

            // CROSS-DOMAIN EDGES (The secret sauce)
            { source: "PA Operations", target: "Python", value: 2 },
            { source: "Clinical Policy", target: "RAG / AI Agents", value: 2 },
            { source: "Workflow Translation", target: "RPA / Automation", value: 2 },
            { source: "Process Design", target: "RPA / Automation", value: 1 },
            { source: "PA Operations", target: "Team Supervision", value: 1 },
            { source: "MCO Workflows", target: "Data Viz", value: 1 },
            { source: "Workflow Translation", target: "Python", value: 1 }
        ]
    };

    // Enhance node data
    data.nodes.forEach(n => {
        n.isHub = hubs.includes(n.id);
        n.radius = n.isHub ? n.baseRadius * 1.8 : n.baseRadius;
    });

    // Clear previous simulation if any
    container.innerHTML = '';

    // Setup SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height])
        .style("max-width", "100%")
        .style("height", "auto")
        .style("overflow", "visible"); // Allow slight bleeding if physics bounce hard

    // Add CSS definitions for animations and text shadow
    svg.append("style").text(`
        @keyframes pulseGlow {
            0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.05)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(255,255,255,0.15)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.05)); }
        }
        .node-core {
            animation: pulseGlow 4s infinite ease-in-out;
            transform-origin: center;
        }
        .node-label {
            text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5);
            pointer-events: none;
            transition: all 0.3s ease;
        }
        .edge-line {
            transition: stroke-opacity 0.3s ease;
        }
    `);

    // Define gradients for edges and custom soft radial gradients for node halos
    const defs = svg.append("defs");

    // Add soft radial gradients for each color group
    Object.keys(colors).forEach(group => {
        const radGrad = defs.append("radialGradient")
            .attr("id", `glow-${group}`)
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%");

        // Solid core color
        radGrad.append("stop").attr("offset", "20%").attr("stop-color", colors[group]).attr("stop-opacity", 1);
        // Fade out to soft halo
        radGrad.append("stop").attr("offset", "40%").attr("stop-color", colors[group]).attr("stop-opacity", 0.4);
        radGrad.append("stop").attr("offset", "100%").attr("stop-color", colors[group]).attr("stop-opacity", 0);
    });
    data.links.forEach((l, i) => {
        const gradientId = `grad-${i}`;
        const gradient = defs.append("linearGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse");

        l.gradientId = gradientId;
    });

    // Force Simulation configuration
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(140)) // push nodes much further apart
        .force("charge", d3.forceManyBody().strength(-400)) // increase spread dramatically
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => (d.radius * 3) + 20).iterations(6)) // stronger collision factoring in the glow
        .alphaTarget(0.01) // continuous ambient motion
        .velocityDecay(0.6); // keeps it moving slowly but calmly

    // Draw lines (base opacity 0.3)
    const link = svg.append("g")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("class", "edge-line")
        .attr("stroke", d => `url(#${d.gradientId})`)
        .attr("stroke-opacity", 0.3)
        .attr("stroke-width", d => Math.max(1, Math.sqrt(d.value) * 1.5));

    // Groups for nodes and text
    const nodeGroup = svg.append("g")
        .selectAll("g")
        .data(data.nodes)
        .join("g")
        .call(drag(simulation));

    // Draw single circles with radial gradient fill for a seamless core+glow
    // We make the radius 3x larger to accommodate the fully transparent feathered edge
    const circle = nodeGroup.append("circle")
        .attr("class", "node-core")
        .attr("r", d => d.radius * 3)
        .attr("fill", d => `url(#glow-${d.group})`)
        .style("animation-delay", d => `${Math.random() * 4}s`);

    // Draw labels
    const label = nodeGroup.append("text")
        .attr("class", "node-label")
        .text(d => d.id)
        .attr("x", d => d.radius + 8)
        .attr("y", 4)
        .attr("font-size", d => d.isHub ? "12px" : "11px")
        .attr("font-weight", d => d.isHub ? "600" : "400")
        .attr("fill", "#ffffff")
        .attr("opacity", d => d.isHub ? 0.9 : 0);

    // Hover Interaction
    nodeGroup.on("mouseover", function (event, d) {
        // Boost node size slightly
        d3.select(this).select(".node-core")
            .attr("r", d.radius * 3.3);

        // Show all connected labels & dim others
        const connectedNodes = new Set([d.id]);

        // Highlight logic for edges
        link.attr("stroke-opacity", function (l) {
            if (l.source.id === d.id || l.target.id === d.id) {
                connectedNodes.add(l.source.id);
                connectedNodes.add(l.target.id);
                return 0.8;
            } else {
                return 0.1;
            }
        });

        // Highlight logic for nodes and labels
        nodeGroup.selectAll(".node-core")
            .attr("fill-opacity", n => connectedNodes.has(n.id) ? 1 : 0.2);

        nodeGroup.selectAll("text")
            .attr("opacity", n => connectedNodes.has(n.id) ? 1 : (n.isHub ? 0.2 : 0))
            .attr("font-size", n => n.id === d.id ? "14px" : (n.isHub ? "12px" : "11px"));
    })
        .on("mouseout", function (event, d) {
            // Reset node styles
            circle.attr("fill-opacity", 1)
                .attr("r", n => n.radius * 3);

            // Reset text styles
            label.attr("opacity", n => n.isHub ? 0.9 : 0)
                .attr("font-size", n => n.isHub ? "12px" : "11px");

            // Reset edge opacity
            link.attr("stroke-opacity", 0.3);
        });

    // Mouse repelling interaction
    svg.on("mousemove", function (event) {
        const [mx, my] = d3.pointer(event);
        // Add a gentle repelling force
        simulation.force("repel", d3.forceManyBody().strength(d => {
            const dx = d.x - mx;
            const dy = d.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist < 120 ? -80 : 0;
        }));
        simulation.alpha(0.05).restart();
    });

    svg.on("mouseleave", function () {
        simulation.force("repel", null);
    });

    // Update positions on tick and constrain within bounding box
    simulation.on("tick", () => {
        // Update nodes with constraint box
        nodeGroup.attr("transform", d => {
            // Allow nodes to bleed slightly off the container so they get safely cropped by overflow:hidden
            // But keep the core node center near the edge to prevent disappearing completely
            const padding = 0;
            d.x = Math.max(-padding, Math.min(width + padding, d.x));
            d.y = Math.max(-padding, Math.min(height + padding, d.y));
            return `translate(${d.x},${d.y})`;
        });

        // Update links and gradients
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // Update gradient coordinates dynamically so the color shifts correctly from source to target
        defs.selectAll("linearGradient").each(function (d, i) {
            const l = data.links[i];
            const grad = d3.select(this);
            grad.attr("x1", l.source.x).attr("y1", l.source.y)
                .attr("x2", l.target.x).attr("y2", l.target.y);

            // Update stops if they don't exist yet
            if (grad.selectAll("stop").empty()) {
                grad.append("stop").attr("offset", "0%").attr("stop-color", colors[l.source.group]);
                grad.append("stop").attr("offset", "100%").attr("stop-color", colors[l.target.group]);
            }
        });
    });

    // Drag behavior definition
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0.01); // restore ambient alpha
            event.subject.fx = null;
            event.subject.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
}

// Ensure init is called after content load
if (typeof d3 !== 'undefined') {
    initSkillGraph();
} else {
    // If D3 loads slightly after app.js
    window.addEventListener('load', initSkillGraph);
}
