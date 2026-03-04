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

    // --- Project Card Expand/Collapse ---
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Find the parent expandable container and the details section
            const expandableContainer = this.closest('.project-expandable');
            const detailsSection = expandableContainer.querySelector('.project-details');
            const icon = this.querySelector('.expand-icon');

            // Toggle expanded class
            detailsSection.classList.toggle('expanded');

            // Update button text and icon
            if (detailsSection.classList.contains('expanded')) {
                this.innerHTML = 'Show less <span class="expand-icon rotated">-</span>';
                // Need to set max-height explicitly for transition to work properly
                detailsSection.style.maxHeight = detailsSection.scrollHeight + 20 + "px";
            } else {
                this.innerHTML = 'Read more <span class="expand-icon">+</span>';
                detailsSection.style.maxHeight = "0px";
            }
        });
    });

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
            // --- INTERNAL EDGES (Max 2-3 per cluster) ---

            // Clinical internal
            { source: "RN License", target: "PA Operations", value: 1 },
            { source: "PA Operations", target: "MCO Workflows", value: 1 },
            { source: "Clinical Policy", target: "CMS Regs", value: 1 },

            // Technical internal
            { source: "Python", target: "RAG / AI Agents", value: 1 },
            { source: "Python", target: "RPA / Automation", value: 1 },
            { source: "Flask", target: "Data Viz", value: 1 },

            // Operational internal
            { source: "Process Design", target: "Workflow Translation", value: 1 },
            { source: "Team Supervision", target: "SLA Management", value: 1 },

            // --- CROSS-CLUSTER EDGES (The main focus ~60% ratio) ---

            // Clinical <-> Technical
            { source: "PA Operations", target: "Python", value: 2 },
            { source: "PA Operations", target: "RAG / AI Agents", value: 2 },
            { source: "PA Operations", target: "RPA / Automation", value: 2 },
            { source: "Clinical Policy", target: "RAG / AI Agents", value: 2 },
            { source: "Clinical Policy", target: "Prompt Eng", value: 1 },
            { source: "RN License", target: "Data Viz", value: 1 },
            { source: "UM Review", target: "Python", value: 1 },
            { source: "MCO Workflows", target: "Flask", value: 1 },

            // Technical <-> Operations
            { source: "Python", target: "Process Design", value: 2 },
            { source: "Python", target: "SLA Management", value: 1 },
            { source: "RAG / AI Agents", target: "Training Dev", value: 1 },
            { source: "RPA / Automation", target: "Workflow Translation", value: 2 },
            { source: "Data Viz", target: "Team Supervision", value: 1 },
            { source: "Flask", target: "SLA Management", value: 1 },

            // Clinical <-> Operations
            { source: "PA Operations", target: "Team Supervision", value: 2 },
            { source: "PA Operations", target: "Workflow Translation", value: 2 },
            { source: "CMS Regs", target: "Process Design", value: 1 },
            { source: "Clinical Policy", target: "Training Dev", value: 1 },
            { source: "UM Review", target: "Workflow Translation", value: 1 }
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
        @keyframes pulseGlowHero {
            0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.05)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(255,255,255,0.15)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.05)); }
        }
        .hero-node-core {
            animation: pulseGlowHero 4s infinite ease-in-out;
            transform-origin: center;
        }
        .hero-node-label {
            text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5);
            pointer-events: none;
            transition: all 0.3s ease;
        }
        .hero-edge-line {
            transition: stroke-opacity 0.3s ease;
        }
    `);

    // Define gradients for edges and custom soft radial gradients for node halos
    const defs = svg.append("defs");

    // Add soft radial gradients for each color group
    Object.keys(colors).forEach(group => {
        const radGrad = defs.append("radialGradient")
            .attr("id", `hero-glow-${group}`)
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
        const gradientId = `hero-grad-${i}`;
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
        .attr("class", "hero-edge-line")
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
        .attr("class", "hero-node-core")
        .attr("r", d => d.radius * 3)
        .attr("fill", d => `url(#hero-glow-${d.group})`)
        .style("animation-delay", d => `${Math.random() * 4}s`);

    // Draw labels
    const label = nodeGroup.append("text")
        .attr("class", "hero-node-label")
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
        d3.select(this).select(".hero-node-core")
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
        nodeGroup.selectAll("circle.hero-node-core")
            .attr("opacity", n => connectedNodes.has(n.id) ? 1 : 0.2);

        nodeGroup.selectAll("text.hero-node-label")
            .attr("opacity", n => connectedNodes.has(n.id) ? 1 : (n.isHub ? 0.2 : 0))
            .attr("font-size", n => n.id === d.id ? "14px" : (n.isHub ? "12px" : "11px"));
    })
        .on("mouseout", function (event, d) {
            // Reset node styles
            circle.attr("opacity", 1)
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
        // Update nodes with strict 50% width constraint box to avoid clipping into hero text on the left
        nodeGroup.attr("transform", d => {
            const padding = 20;
            // The container is absolutely positioned, so width is its bounds. 
            // We ensure d.x is never less than 0 natively, but actually clamp it strictly.
            d.x = Math.max(padding, Math.min(width - padding, d.x));
            d.y = Math.max(padding, Math.min(height - padding, d.y));
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

// --- D3.js Ambient Skills Graph (Decorative Background) ---
function initAmbientSkillsGraph() {
    const section = document.getElementById('skills');
    const container = document.getElementById('skills-graph');
    if (!section || !container) return;

    // Clear existing content in case of re-init
    container.innerHTML = '';

    let width = section.offsetWidth;
    let height = section.offsetHeight;

    // Use prompt's specific colors
    const colors = {
        clinical: '#4A9EC9',
        technical: '#4CAF50',
        operational: '#D4A843'
    };

    const highlighted = [
        "Python",
        "RAG / AI Agents",
        "PA Operations (Texas Medicaid)",
        "RN License (Active, Texas)",
        "Prompt Engineering",
        "Clinical Workflow → Technical Requirements Translation"
    ];

    const nodes = [
        // Clinical
        { id: "RN License (Active, Texas)", group: "clinical" },
        { id: "PA Operations (Texas Medicaid)", group: "clinical" },
        { id: "Utilization Management", group: "clinical" },
        { id: "CMS Regulations", group: "clinical" },
        { id: "MCO Transitions & Eligibility", group: "clinical" },
        { id: "Clinical Policy (TMPPM)", group: "clinical" },
        // Technical
        { id: "Python", group: "technical" },
        { id: "Flask", group: "technical" },
        { id: "PySimpleGUI", group: "technical" },
        { id: "RPA (pyautogui, Selenium)", group: "technical" },
        { id: "RAG / AI Agents", group: "technical" },
        { id: "Microsoft Copilot Studio", group: "technical" },
        { id: "Prompt Engineering", group: "technical" },
        { id: "Data Visualization (Chart.js)", group: "technical" },
        { id: "Algorithm Design", group: "technical" },
        { id: "Excel Automation (openpyxl)", group: "technical" },
        { id: "Power Automate", group: "technical" },
        { id: "Compliance-Aware Process Automation", group: "technical" },
        // Operational
        { id: "Clinical Workflow → Technical Requirements Translation", group: "operational" },
        { id: "Process Design & Documentation", group: "operational" },
        { id: "Performance Management (PIPs, QA)", group: "operational" },
        { id: "Training Development", group: "operational" },
        { id: "Root Cause Analysis & QA Auditing", group: "operational" },
        { id: "Clinical Staff Onboarding & Enablement", group: "operational" },
        { id: "SLA Management & Capacity Planning", group: "operational" },
        { id: "Cross-Functional Stakeholder Coordination", group: "operational" }
    ];

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const laneCenterByGroup = (group) => {
        if (group === 'clinical') return 0.18;
        if (group === 'technical') return 0.5;
        return 0.82;
    };

    function updateNodeAnchorTargets() {
        const sectionRect = section.getBoundingClientRect();
        const pillAnchors = new Map();

        section.querySelectorAll('.pill[data-skill]').forEach(pill => {
            const skillName = pill.getAttribute('data-skill');
            const rect = pill.getBoundingClientRect();

            pillAnchors.set(skillName, {
                x: (rect.left + (rect.width / 2)) - sectionRect.left,
                y: (rect.top + (rect.height / 2)) - sectionRect.top
            });
        });

        nodes.forEach(d => {
            const anchor = pillAnchors.get(d.id);
            if (anchor) {
                d.targetXNorm = clamp(anchor.x / width, 0.06, 0.94);
                d.targetYNorm = clamp(anchor.y / height, 0.08, 0.92);
                return;
            }

            // Fallback if a node has no matching pill.
            d.targetXNorm = laneCenterByGroup(d.group);
            d.targetYNorm = 0.5;
        });
    }

    nodes.forEach(d => {
        d.radius = highlighted.includes(d.id) ? 7 : 5;
    });

    updateNodeAnchorTargets();

    nodes.forEach(d => {
        d.x = (d.targetXNorm * width) + ((Math.random() - 0.5) * 30);
        d.y = (d.targetYNorm * height) + ((Math.random() - 0.5) * 30);
    });

    const links = [
        // Internal Clinical
        { source: "RN License (Active, Texas)", target: "PA Operations (Texas Medicaid)" },
        { source: "Utilization Management", target: "PA Operations (Texas Medicaid)" },
        { source: "CMS Regulations", target: "MCO Transitions & Eligibility" },
        { source: "Clinical Policy (TMPPM)", target: "CMS Regulations" },
        { source: "MCO Transitions & Eligibility", target: "Utilization Management" },

        // Internal Technical
        { source: "Python", target: "Flask" },
        { source: "Python", target: "RPA (pyautogui, Selenium)" },
        { source: "Python", target: "Excel Automation (openpyxl)" },
        { source: "Python", target: "Algorithm Design" },
        { source: "RAG / AI Agents", target: "Prompt Engineering" },
        { source: "RAG / AI Agents", target: "Microsoft Copilot Studio" },
        { source: "Data Visualization (Chart.js)", target: "Flask" },
        { source: "PySimpleGUI", target: "Python" },
        { source: "Power Automate", target: "Microsoft Copilot Studio" },
        { source: "Power Automate", target: "Compliance-Aware Process Automation" },
        { source: "Compliance-Aware Process Automation", target: "RPA (pyautogui, Selenium)" },

        // Internal Operational
        { source: "Clinical Workflow → Technical Requirements Translation", target: "Process Design & Documentation" },
        { source: "Process Design & Documentation", target: "Performance Management (PIPs, QA)" },
        { source: "Training Development", target: "Clinical Staff Onboarding & Enablement" },
        { source: "Clinical Staff Onboarding & Enablement", target: "Root Cause Analysis & QA Auditing" },
        { source: "SLA Management & Capacity Planning", target: "Process Design & Documentation" },
        { source: "Cross-Functional Stakeholder Coordination", target: "SLA Management & Capacity Planning" },
        { source: "Cross-Functional Stakeholder Coordination", target: "Training Development" },

        // Cross-Cluster user requested
        { source: "PA Operations (Texas Medicaid)", target: "Python" },
        { source: "Clinical Policy (TMPPM)", target: "RAG / AI Agents" },
        { source: "CMS Regulations", target: "Clinical Workflow → Technical Requirements Translation" },
        { source: "Utilization Management", target: "Process Design & Documentation" },
        { source: "RN License (Active, Texas)", target: "Clinical Policy (TMPPM)" },
        { source: "PA Operations (Texas Medicaid)", target: "Prompt Engineering" },
        { source: "Compliance-Aware Process Automation", target: "Process Design & Documentation" },

        // Additional cross-cluster bridges for better interconnection
        { source: "MCO Transitions & Eligibility", target: "Cross-Functional Stakeholder Coordination" },
        { source: "CMS Regulations", target: "Compliance-Aware Process Automation" },
        { source: "PA Operations (Texas Medicaid)", target: "SLA Management & Capacity Planning" },
        { source: "Clinical Policy (TMPPM)", target: "Process Design & Documentation" },
        { source: "Utilization Management", target: "Data Visualization (Chart.js)" },
        { source: "RN License (Active, Texas)", target: "Training Development" },
        { source: "Python", target: "Clinical Workflow → Technical Requirements Translation" },
        { source: "Flask", target: "SLA Management & Capacity Planning" },
        { source: "Algorithm Design", target: "Process Design & Documentation" },
        { source: "Data Visualization (Chart.js)", target: "Performance Management (PIPs, QA)" },
        { source: "Microsoft Copilot Studio", target: "Clinical Workflow → Technical Requirements Translation" },
        { source: "Prompt Engineering", target: "Clinical Policy (TMPPM)" },
        { source: "RPA (pyautogui, Selenium)", target: "Process Design & Documentation" },
        { source: "Power Automate", target: "Cross-Functional Stakeholder Coordination" },
        { source: "Clinical Staff Onboarding & Enablement", target: "PA Operations (Texas Medicaid)" },
        { source: "Root Cause Analysis & QA Auditing", target: "Utilization Management" }
    ];

    const svg = d3.select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height]);

    // Setup radial gradients for glow
    const defs = svg.append("defs");
    Object.entries(colors).forEach(([group, color]) => {
        const grad = defs.append("radialGradient")
            .attr("id", `glow-${group}`)
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%");

        // 14% opacity to transparent for better visibility
        grad.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", color)
            .attr("stop-opacity", 0.14);

        grad.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", color)
            .attr("stop-opacity", 0);
    });

    // Draw links
    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", "graph-edge")
        .attr("data-source", d => typeof d.source === 'string' ? d.source : d.source.id)
        .attr("data-target", d => typeof d.target === 'string' ? d.target : d.target.id)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.7)
        .attr("stroke-opacity", 0.36);

    // Draw nodes
    const nodeGroup = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "graph-node")
        .attr("data-skill", d => d.id);

    // Ambient Glow circle
    nodeGroup.append("circle")
        .attr("class", "node-glow")
        .attr("r", d => d.radius * 3.4)
        .attr("fill", d => `url(#glow-${d.group})`);

    // Core solid circle
    nodeGroup.append("circle")
        .attr("class", "node-core")
        .attr("r", d => d.radius)
        .attr("fill", d => colors[d.group])
        .attr("stroke", "rgba(255,255,255,0.5)")
        .attr("stroke-width", 0.8);

    const forceXTarget = (d) => {
        return d.targetXNorm * width;
    };

    const forceYTarget = (d) => {
        return d.targetYNorm * height;
    };

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(85).strength(0.12))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX().x(forceXTarget).strength(0.08))
        .force("y", d3.forceY().y(forceYTarget).strength(0.08))
        .force("collide", d3.forceCollide().radius(d => (d.radius * 2.4) + 6).iterations(2))
        .velocityDecay(0.6)
        .alphaTarget(0.003);

    simulation.on("tick", () => {
        // Clamp bounds inside tick so nodes stay within the visible area
        nodes.forEach(d => {
            d.x = Math.max(28, Math.min(width - 28, d.x));
            d.y = Math.max(28, Math.min(height - 28, d.y));
        });

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        nodeGroup.selectAll(".node-glow")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        nodeGroup.selectAll(".node-core")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        width = section.offsetWidth;
        height = section.offsetHeight;

        svg.attr("viewBox", [0, 0, width, height]);

        updateNodeAnchorTargets();

        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.force("x", d3.forceX().x(d => d.targetXNorm * width).strength(0.08));
        simulation.force("y", d3.forceY().y(d => d.targetYNorm * height).strength(0.08));

        // Gentle kick to adjust to new bounds
        simulation.alpha(0.15).restart();
    });

    // One post-layout pass to avoid stale pill rects on first paint.
    window.requestAnimationFrame(() => {
        updateNodeAnchorTargets();
        simulation.alpha(0.12).restart();
    });

    // Re-anchor once fonts are ready in case pill widths/positions shift post-render.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            updateNodeAnchorTargets();
            simulation.alpha(0.1).restart();
        }).catch(() => {
            // No-op: fallback anchors are already applied above.
        });
    }

    // Handle Hover Interactivity from Pills
    // Use matchMedia to ensure we only attach these listeners on devices with hover capability
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (mql.matches) {
        const pills = document.querySelectorAll('.pill[data-skill]');

        pills.forEach(pill => {
            pill.addEventListener('mouseenter', () => {
                const skillName = pill.getAttribute('data-skill');

                // Activate container
                container.classList.add('active');

                // Dim all nodes and edges
                svg.selectAll('.graph-node').classed('dimmed', true);
                svg.selectAll('.graph-edge').classed('dimmed', true);

                // Highlight target node
                const targetNode = svg.select(`.graph-node[data-skill="${CSS.escape(skillName)}"]`);
                if (!targetNode.empty()) {
                    targetNode.classed('dimmed', false);
                    targetNode.classed('highlighted', true);
                }

                const connectedSkillNames = [];

                // Highlight connected edges and the neighbor nodes
                svg.selectAll('.graph-edge').each(function (d) {
                    const sourceId = d.source.id;
                    const targetId = d.target.id;

                    if (sourceId === skillName || targetId === skillName) {
                        d3.select(this).classed('dimmed', false).classed('highlighted', true);

                        // Also un-dim the neighbor node so it's visible at end of edge
                        svg.select(`.graph-node[data-skill="${CSS.escape(sourceId)}"]`).classed('dimmed', false);
                        svg.select(`.graph-node[data-skill="${CSS.escape(targetId)}"]`).classed('dimmed', false);

                        if (sourceId !== skillName) connectedSkillNames.push(sourceId);
                        if (targetId !== skillName) connectedSkillNames.push(targetId);
                    }
                });

                // Add subtle pill glow to connected nodes
                document.querySelectorAll('.pill[data-skill]').forEach(p => {
                    if (connectedSkillNames.includes(p.getAttribute('data-skill'))) {
                        p.classList.add('connected-pill');
                    }
                });
            });

            pill.addEventListener('mouseleave', () => {
                // Deactivate container
                container.classList.remove('active');

                // Remove all interaction classes
                svg.selectAll('.graph-node')
                    .classed('dimmed', false)
                    .classed('highlighted', false);

                svg.selectAll('.graph-edge')
                    .classed('dimmed', false)
                    .classed('highlighted', false);

                // Remove connected pill glows
                document.querySelectorAll('.connected-pill').forEach(p => {
                    p.classList.remove('connected-pill');
                });
            });
        });
    }
}

function initTimelineGraphs() {
    // Only run if not on mobile (matching CSS display: none logic)
    if (window.innerWidth <= 768) return;

    const roleSkills = {
        'role-pa-supervisor': [
            { id: "Python", group: "technical", radius: 7, type: 'large' },
            { id: "RAG / AI Agents", group: "technical", radius: 7, type: 'large' },
            { id: "Workflow Translation", group: "operational", radius: 7, type: 'large' },
            { id: "PA Operations", group: "clinical", radius: 7, type: 'large' },
            { id: "Flask", group: "technical", radius: 5, type: 'medium' },
            { id: "Copilot Studio", group: "technical", radius: 5, type: 'medium' },
            { id: "Prompt Eng", group: "technical", radius: 5, type: 'medium' },
            { id: "Algorithm Design", group: "technical", radius: 5, type: 'medium' },
            { id: "Process Design", group: "operational", radius: 5, type: 'medium' },
            { id: "Performance Mgmt", group: "operational", radius: 5, type: 'medium' },
            { id: "CMS Regulations", group: "clinical", radius: 5, type: 'medium' },
            { id: "Utilization Mgmt", group: "clinical", radius: 5, type: 'medium' },
            { id: "Chart.js", group: "technical", radius: 3, type: 'small' },
            { id: "openpyxl", group: "technical", radius: 3, type: 'small' },
            { id: "MCO Transitions", group: "clinical", radius: 3, type: 'small' },
            { id: "Clinical Policy", group: "clinical", radius: 3, type: 'small' },
            { id: "Training Dev", group: "operational", radius: 3, type: 'small' },
            { id: "Staff Onboarding", group: "operational", radius: 3, type: 'small' },
            { id: "RCA & QA", group: "operational", radius: 3, type: 'small' },
            { id: "Compliance Auto", group: "operational", radius: 3, type: 'small' }
        ],
        'role-pa-clinician': [
            { id: "PA Operations", group: "clinical", radius: 7, type: 'large' },
            { id: "Clinical Policy", group: "clinical", radius: 7, type: 'large' },
            { id: "Python", group: "technical", radius: 7, type: 'large' },
            { id: "RN License", group: "clinical", radius: 5, type: 'medium' },
            { id: "CMS Regulations", group: "clinical", radius: 5, type: 'medium' },
            { id: "RPA (pyautogui)", group: "technical", radius: 5, type: 'medium' },
            { id: "Process Design", group: "operational", radius: 5, type: 'medium' },
            { id: "PySimpleGUI", group: "technical", radius: 3, type: 'small' }
        ],
        'role-home-health': [
            { id: "Python", group: "technical", radius: 7, type: 'large' },
            { id: "RPA (Selenium)", group: "technical", radius: 7, type: 'large' },
            { id: "RN License", group: "clinical", radius: 5, type: 'medium' },
            { id: "Data Viz", group: "technical", radius: 5, type: 'medium' },
            { id: "openpyxl", group: "technical", radius: 3, type: 'small' },
            { id: "Compliance Auto", group: "operational", radius: 3, type: 'small' }
        ],
        'role-neuro': [
            { id: "RN License", group: "clinical", radius: 7, type: 'large' },
            { id: "Staff Onboarding", group: "operational", radius: 5, type: 'medium' }
        ]
    };

    const roleEdges = {
        'role-pa-supervisor': [
            { source: "Python", target: "Flask" },
            { source: "Python", target: "RAG / AI Agents" },
            { source: "Copilot Studio", target: "Prompt Eng" },
            { source: "Flask", target: "Chart.js" },
            { source: "Python", target: "Algorithm Design" },
            { source: "PA Operations", target: "CMS Regulations" },
            { source: "PA Operations", target: "Clinical Policy" },
            { source: "Utilization Mgmt", target: "MCO Transitions" },
            { source: "Workflow Translation", target: "Process Design" },
            { source: "Performance Mgmt", target: "RCA & QA" },
            { source: "Staff Onboarding", target: "Training Dev" },
            { source: "Compliance Auto", target: "Process Design" }
        ],
        'role-pa-clinician': [
            { source: "Python", target: "RPA (pyautogui)" },
            { source: "Python", target: "PySimpleGUI" },
            { source: "PA Operations", target: "Clinical Policy" },
            { source: "PA Operations", target: "CMS Regulations" }
        ],
        'role-home-health': [
            { source: "Python", target: "RPA (Selenium)" },
            { source: "Python", target: "openpyxl" }
        ],
        'role-neuro': []
    };

    const tooltipContent = {
        "Python": "PA GUI · Staffing Dashboard · Selenium Automation · Inventory Bot",
        "RAG / AI Agents": "TMPPM Policy Indexer",
        "Copilot Studio": "TMPPM Policy Indexer",
        "Prompt Eng": "TMPPM Policy Indexer",
        "Flask": "Operations Dashboard + Planner",
        "Algorithm Design": "Operations Dashboard + Planner",
        "Chart.js": "Operations Dashboard + Planner",
        "RPA (pyautogui)": "PA Processing Automation GUI",
        "PySimpleGUI": "PA Processing Automation GUI",
        "RPA (Selenium)": "Selenium Documentation Automation",
        "openpyxl": "Inventory Automation Bot",
        "Data Viz": "Operations Dashboard · Patient Dashboard",
        "Workflow Translation": "Policy-to-automation design across all supervisor tools",
        "PA Operations": "Core domain — 15,000+ requests/month",
        "RN License": "Active, Texas — clinical foundation across all roles",
        "Clinical Policy": "Medicaid policy interpretation & gray-area adjudication",
        "CMS Regulations": "Federal compliance framework for PA operations",
        "Performance Mgmt": "Team of 45+ staff — metrics, coaching, reviews",
        "Utilization Mgmt": "Medical necessity review & resource allocation",
        "Process Design": "Workflow engineering across clinical operations",
        "MCO Transitions": "Managed care organization migration coordination",
        "Training Dev": "Onboarding curriculum & continuing education programs",
        "Staff Onboarding": "New hire integration & competency validation",
        "RCA & QA": "Root cause analysis & quality assurance protocols",
        "Compliance Auto": "Automated compliance monitoring & reporting"
    };
    const defaultTooltip = "Supporting skill in this role";

    const colors = {
        clinical: '#60a5fa',
        technical: '#4ade80',
        operational: '#fbbf24'
    };

    // Create shared tooltip element
    let tooltip = document.querySelector('.timeline-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'timeline-tooltip';
        document.body.appendChild(tooltip);

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.timeline-node-group') && !e.target.closest('.timeline-tooltip')) {
                tooltip.classList.remove('visible');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') tooltip.classList.remove('visible');
        });
    }

    // Use Intersection observer to trigger graph animations when scrolled into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                if (!container.dataset.initialized) {
                    renderGraph(container);
                    container.dataset.initialized = 'true';
                }
            }
        });
    }, { threshold: 0.1 });

    Object.keys(roleSkills).forEach(roleId => {
        const item = document.getElementById(roleId);
        if (item) {
            const container = item.querySelector('.timeline-graph-container');
            if (container) observer.observe(container);
        }
    });

    function renderGraph(container) {
        const roleId = container.parentElement.id;
        const nodes = roleSkills[roleId].map(d => Object.create(d));
        const links = (roleEdges[roleId] || []).map(d => Object.create(d));

        const width = container.clientWidth || 300;

        // Capture the collapsed card position at render time using exact pixel positions.
        // getBoundingClientRect gives us the true screen positions of both elements,
        // so we can compute exactly where the card sits inside the SVG coordinate space.
        const cardContent = container.parentElement.querySelector('.timeline-content');
        const cardRect = cardContent.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const collapsedCardHeight = cardRect.height;
        const cardTopInSvg = cardRect.top - containerRect.top;
        const cardMidY = cardTopInSvg + (collapsedCardHeight / 2);

        // Detect which side the item is on and bias nodes toward the timeline center line
        const isRight = container.parentElement.classList.contains('right');
        // For right-side items, the graph is on the LEFT, so push nodes toward the right edge (near timeline)
        // For left-side items, the graph is on the RIGHT, so push nodes toward the left edge (near timeline)
        const targetX = isRight ? width * 0.75 : width * 0.25;

        const svg = d3.select(container).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("overflow", "visible");

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(60).strength(0.2))
            .force("charge", d3.forceManyBody().strength(-150))
            .force("x", d3.forceX(targetX).strength(0.06))
            .force("y", d3.forceY(cardMidY).strength(0.08))
            .alphaTarget(0.005)
            .velocityDecay(0.6);

        // Render edges before nodes so nodes layer on top
        const edgeGroup = svg.append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("class", "timeline-edge")
            .attr("stroke", d => colors[d.source.group] || "rgba(255,255,255,0.2)")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 0.15)
            .style("transition", "stroke-opacity 0.2s ease, stroke-width 0.2s ease")
            .style("pointer-events", "none");

        const nodeGroup = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("class", "timeline-node-group")
            .attr("data-skill", d => d.id)
            .style("cursor", "pointer")
            .style("opacity", 0);

        // Inner group for CSS idle drift (separate from D3 translate)
        const nodeInner = nodeGroup.append("g")
            .attr("class", "timeline-node-inner")
            .style("animation-duration", () => `${3 + Math.random() * 3}s`)
            .style("animation-delay", () => `-${Math.random() * 3}s`);

        // Subtle glow
        nodeInner.append("circle")
            .attr("r", d => d.radius * 2.5)
            .attr("fill", d => colors[d.group])
            .attr("opacity", 0.15);

        // Core circle
        nodeInner.append("circle")
            .attr("class", "timeline-node-core")
            .attr("r", d => d.radius)
            .attr("fill", d => d.type === 'small' ? colors[d.group] : "transparent")
            .attr("stroke", d => colors[d.group])
            .attr("stroke-width", 1.5);

        // Labels
        nodeInner.append("text")
            .attr("class", "timeline-node-label")
            .text(d => d.id)
            .attr("x", d => d.radius + 8)
            .attr("y", 4)
            .attr("font-size", d => d.type === 'large' ? "12px" : "10px")
            .attr("font-weight", d => d.type === 'large' ? "600" : "500")
            .attr("fill", "rgba(255,255,255,0.7)")
            .style("opacity", d => d.type === 'small' ? 0 : 1)
            .style("pointer-events", "none")
            .style("transition", "opacity 0.2s ease")
            .each(function (d) {
                d.labelAnchor = 'right';
                const charW = d.type === 'large' ? 7 : 6;
                d.labelW = d.id.length * charW;
                d.labelH = d.type === 'large' ? 14 : 12;
            });

        // --- Cross-Timeline Hover ---
        nodeGroup.on("mouseover", function (event, d) {
            document.querySelectorAll('.timeline-graph-container').forEach(c => c.classList.add('interaction-active'));

            document.querySelectorAll('.timeline-node-group').forEach(group => {
                const inner = group.querySelector('.timeline-node-inner');
                const nodeData = d3.select(group).datum();
                if (group.getAttribute('data-skill') === d.id) {
                    group.classList.add('timeline-highlighted');
                    group.classList.remove('timeline-dimmed');
                    d3.select(inner).select("circle.timeline-node-core")
                        .transition().duration(200)
                        .attr("r", nodeData.radius * 1.2)
                        .attr("fill", colors[nodeData.group])
                        .attr("fill-opacity", 0.3);
                    d3.select(inner).select("text")
                        .transition().duration(200)
                        .style("opacity", 1)
                        .attr("fill", "#ffffff")
                        .attr("font-weight", "600");
                } else {
                    group.classList.add('timeline-dimmed');
                    group.classList.remove('timeline-highlighted');
                }
            });

            // Highlight connected edges
            d3.selectAll('.timeline-edge').each(function (l) {
                if (l.source.id === d.id || l.target.id === d.id) {
                    d3.select(this).attr("stroke-opacity", 0.6).attr("stroke-width", 1.5);
                } else {
                    d3.select(this).attr("stroke-opacity", 0.05);
                }
            });
        }).on("mouseout", function (event, d) {
            document.querySelectorAll('.timeline-graph-container').forEach(c => c.classList.remove('interaction-active'));

            document.querySelectorAll('.timeline-node-group').forEach(group => {
                group.classList.remove('timeline-dimmed', 'timeline-highlighted');
                const nodeData = d3.select(group).datum();
                const inner = group.querySelector('.timeline-node-inner');
                if (nodeData) {
                    d3.select(inner).select("circle.timeline-node-core")
                        .transition().duration(300)
                        .attr("r", nodeData.radius)
                        .attr("fill", nodeData.type === 'small' ? colors[nodeData.group] : "transparent")
                        .attr("fill-opacity", 1);
                    d3.select(inner).select("text")
                        .transition().duration(300)
                        .style("opacity", nodeData.type === 'small' ? 0 : 1)
                        .attr("fill", "rgba(255,255,255,0.7)")
                        .attr("font-weight", nodeData.type === 'large' ? "600" : "500");
                }
            });

            d3.selectAll('.timeline-edge')
                .attr("stroke-opacity", 0.15)
                .attr("stroke-width", 1);
        }).on("click", function (event, d) {
            event.stopPropagation();
            const content = tooltipContent[d.id] || defaultTooltip;
            tooltip.innerHTML = `<strong>${d.id}</strong><br/>${content}`;
            tooltip.style.left = `${event.pageX + 15}px`;
            tooltip.style.top = `${event.pageY + 15}px`;
            tooltip.classList.add('visible');
        });

        // Staggered fade-in
        nodeGroup.transition()
            .delay((d, i) => i * 60)
            .duration(800)
            .style("opacity", 1);

        // --- Collision Detection Helper ---
        // Accepts bounds so nodes are never pushed outside the card
        const resolveCollisions = (yMin, yMax) => {
            const LABEL_PAD = 6;
            for (let pass = 0; pass < 50; pass++) {
                let overlapFound = false;
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const a = nodes[i];
                        const b = nodes[j];

                        if (a.type === 'small' && b.type === 'small') {
                            const dx = a.x - b.x;
                            const dy = a.y - b.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 20) {
                                overlapFound = true;
                                const push = (20 - dist) / 2;
                                const angle = Math.atan2(dy, dx);
                                a.x += Math.cos(angle) * push;
                                a.y += Math.sin(angle) * push;
                                b.x -= Math.cos(angle) * push;
                                b.y -= Math.sin(angle) * push;
                                a.y = Math.max(yMin, Math.min(yMax, a.y));
                                b.y = Math.max(yMin, Math.min(yMax, b.y));
                            }
                            continue;
                        }

                        const getBox = (n) => {
                            if (n.type === 'small') {
                                return { left: n.x - 10, right: n.x + 10, top: n.y - 10, bottom: n.y + 10 };
                            }
                            const x1 = n.labelAnchor === 'right' ? n.x + n.radius + 8 : n.x - n.radius - 8 - n.labelW;
                            const x2 = n.labelAnchor === 'right' ? n.x + n.radius + 8 + n.labelW : n.x - n.radius - 8;
                            const fullLeft = Math.min(n.x - n.radius, x1);
                            const fullRight = Math.max(n.x + n.radius, x2);
                            return {
                                left: fullLeft - LABEL_PAD,
                                right: fullRight + LABEL_PAD,
                                top: n.y - (n.labelH / 2) - LABEL_PAD,
                                bottom: n.y + (n.labelH / 2) + LABEL_PAD
                            };
                        };

                        const boxA = getBox(a);
                        const boxB = getBox(b);

                        if (boxA.left < boxB.right && boxA.right > boxB.left &&
                            boxA.top < boxB.bottom && boxA.bottom > boxB.top) {
                            overlapFound = true;

                            // Try flipping label anchors first
                            if (a.type !== 'small') {
                                const oldAnchor = a.labelAnchor;
                                a.labelAnchor = oldAnchor === 'right' ? 'left' : 'right';
                                const newBoxA = getBox(a);
                                if (!(newBoxA.left < boxB.right && newBoxA.right > boxB.left && newBoxA.top < boxB.bottom && newBoxA.bottom > boxB.top)) {
                                    continue;
                                }
                                a.labelAnchor = oldAnchor;
                            }

                            if (b.type !== 'small') {
                                const oldAnchor = b.labelAnchor;
                                b.labelAnchor = oldAnchor === 'right' ? 'left' : 'right';
                                const newBoxB = getBox(b);
                                if (!(boxA.left < newBoxB.right && boxA.right > newBoxB.left && boxA.top < newBoxB.bottom && boxA.bottom > newBoxB.top)) {
                                    continue;
                                }
                                b.labelAnchor = oldAnchor;
                            }

                            // Push apart on the axis with LESS overlap (easier to resolve)
                            const overlapX = Math.min(boxA.right - boxB.left, boxB.right - boxA.left);
                            const overlapY = Math.min(boxA.bottom - boxB.top, boxB.bottom - boxA.top);

                            if (overlapX < overlapY) {
                                // Push horizontally
                                const pushX = overlapX / 2 + 4;
                                if (a.x < b.x) {
                                    a.x -= pushX;
                                    b.x += pushX;
                                } else {
                                    a.x += pushX;
                                    b.x -= pushX;
                                }
                            } else {
                                // Push vertically
                                const pushY = overlapY / 2 + 2;
                                if (a.y < b.y) {
                                    a.y -= pushY;
                                    b.y += pushY;
                                } else {
                                    a.y += pushY;
                                    b.y -= pushY;
                                }
                            }
                            a.y = Math.max(yMin, Math.min(yMax, a.y));
                            b.y = Math.max(yMin, Math.min(yMax, b.y));
                        }
                    }
                }
                if (!overlapFound) break;
            }
        };

        const boundsTop = cardTopInSvg + 16;
        const boundsBottom = cardTopInSvg + collapsedCardHeight - 16;

        // --- Tick ---
        simulation.on("tick", () => {
            // Step A: Horizontal bounds
            nodes.forEach(d => {
                d.x = Math.max(30, Math.min(width - 30, d.x));
            });

            // Step B: Resolve collisions (with built-in bounds enforcement)
            resolveCollisions(boundsTop, boundsBottom);

            // Step C: Bounding box centering
            let lowestNodeY = Infinity;
            let highestNodeY = -Infinity;
            nodes.forEach(d => {
                if (d.y - d.radius < lowestNodeY) lowestNodeY = d.y - d.radius;
                if (d.y + d.radius > highestNodeY) highestNodeY = d.y + d.radius;
            });
            const clusterMidY = lowestNodeY === Infinity ? cardMidY : (highestNodeY + lowestNodeY) / 2;
            const offsetY = cardMidY - clusterMidY;

            // Only apply centering if the offset is significant (>2px)
            if (Math.abs(offsetY) > 2) {
                nodes.forEach(d => {
                    d.y += offsetY;
                });
            }

            // Step D: Final hard clamp (absolute last step before DOM)
            nodes.forEach(d => {
                d.y = Math.max(boundsTop, Math.min(boundsBottom, d.y));
            });

            // Step E: Apply to DOM
            edgeGroup
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);

            // Flip text anchors based on collision resolution
            nodeGroup.selectAll('text')
                .attr("x", d => d.labelAnchor === 'right' ? d.radius + 8 : -(d.radius + 8))
                .attr("text-anchor", d => d.labelAnchor === 'right' ? "start" : "end");
        });

        simulation.alpha(0.3).restart();
    }

    // Parallax scroll hook
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                document.querySelectorAll('.timeline-graph-container').forEach(container => {
                    container.style.transform = `translateY(${scrollY * 0.05}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Ensure init is called after content load
if (typeof d3 !== 'undefined') {
    initSkillGraph();
    initAmbientSkillsGraph();
    initTimelineGraphs();
} else {
    // If D3 loads slightly after app.js
    window.addEventListener('load', () => {
        initSkillGraph();
        initAmbientSkillsGraph();
        initTimelineGraphs();
    });
}
