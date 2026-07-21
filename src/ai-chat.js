const starterQuestions = [
  'What services does JNS provide?',
  'How can I apply for an internship?',
  'What internship programmes are available?',
  'How can I track my application?',
  'What technologies does JNS use?',
  'Are there any current job openings?',
  'How can I contact JNS support?'
];

const welcomeMessage = {
  role: 'assistant',
  text: 'Welcome to JNS AI. I can help with public information about JNS services, internships, projects, careers, applications, CRM features, and support.'
};

const robotIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3V1.8M8.5 7h7A3.5 3.5 0 0 1 19 10.5v5A3.5 3.5 0 0 1 15.5 19h-7A3.5 3.5 0 0 1 5 15.5v-5A3.5 3.5 0 0 1 8.5 7Z"/><path d="M8.5 19v2M15.5 19v2M5 12H3M21 12h-2"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/><path d="M9.5 15.5h5"/></svg>`;

export function renderAiAssistant(state) {
  const open = Boolean(state.publicChatOpen);
  return `<section class="ai-chat" id="jnsAiChat" role="dialog" aria-label="JNS AI Assistant" ${open ? '' : 'hidden'}>
    <header class="ai-chat-header">
      <span class="ai-robot-icon" role="img" aria-label="JNS AI Assistant">${robotIcon}<i></i></span>
      <div><strong>Ask JNS AI</strong><small><i></i> Available</small></div>
      <button type="button" data-ai-clear aria-label="Clear conversation" title="Clear conversation">↻</button>
      <button type="button" data-ai-minimise aria-label="Minimise JNS AI" title="Minimise">−</button>
    </header>
    <div class="ai-chat-messages" data-ai-messages aria-live="polite" aria-relevant="additions"></div>
    <div class="ai-suggestions" aria-label="Suggested questions">${starterQuestions.slice(0,4).map(question => `<button type="button" data-ai-question="${question}">${question}</button>`).join('')}</div>
    <form class="ai-chat-form">
      <label class="sr-only" for="jnsAiQuestion">Ask a question about JNS</label>
      <input id="jnsAiQuestion" name="question" autocomplete="off" placeholder="Ask about JNS services, internships or support…" required>
      <button type="submit">Send</button>
    </form>
    <p class="ai-chat-helper">Public JNS information only · For personal cases, contact the appropriate JNS team.</p>
  </section>
  <button class="ai-fab" type="button" aria-label="Open JNS AI Assistant" aria-controls="jnsAiChat" aria-expanded="${open}"><span class="ai-robot-icon">${robotIcon}<i></i></span><span>Ask JNS AI</span></button>`;
}

function answerQuestion(question, state) {
  const raw = question.trim();
  const query = raw.toLowerCase();
  const lastTopic = state.publicChatTopic || '';
  const contextualQuery = /^(and|what about|how about|tell me more|more details|why|when|where)\b/.test(query) ? `${query} ${lastTopic}` : query;

  if (/password|credential|api key|database|private data|admin data|internal system|hidden instruction/.test(contextualQuery)) {
    return { topic:'security', text:'I can’t provide passwords, credentials, private records, internal CRM data, or administrative information. I can help with public CRM features or direct you to Support.', page:'support', label:'Contact support' };
  }
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)[!. ]*$/.test(query)) {
    return { topic:lastTopic, text:'Hello! What would you like to know about JNS services, internships, projects, careers, applications, or support?' };
  }
  if (raw.length < 3 || /^(help|information|details|question)$/.test(query)) {
    return { topic:lastTopic, text:'Could you tell me which area you mean—services, internships, applications, projects, careers, CRM access, or support?' };
  }
  if (/track|application status|reference id|where is my application/.test(contextualQuery)) {
    return { topic:'application tracking', text:'Use the public application tracker with your application reference and registered email. For privacy, don’t share those details in this chat. CRM credentials are issued only after approval.', page:'track', label:'Track application' };
  }
  if (/apply|application|join internship|register for internship/.test(contextualQuery)) {
    return { topic:'internship application', text:'Choose a programme, review its duration, mode, fee, and eligibility, then select Apply for Internship. Complete the personal, academic, preference, document, and consent sections. Selection is subject to review and is not guaranteed.', page:'apply', label:'Apply for internship' };
  }
  if (/eligib|who can join|qualification|student requirement/.test(contextualQuery)) {
    return { topic:'internship eligibility', text:'JNS programmes are designed for students and recent graduates with foundational knowledge, consistent availability, and interest in the selected domain. Requirements can vary by programme, so review the programme details or contact the internship coordinator.', page:'programs', label:'Review programmes' };
  }
  if (/fee|price|cost|scholar|stipend|payment|refund/.test(contextualQuery)) {
    const fees = (state.programs || []).slice(0,3).map(program => `${program.title}: ₹${Number(program.fee || 0).toLocaleString('en-IN')}`).join('\n• ');
    return { topic:'programme fees', text:`Current featured programme fees are:\n• ${fees || 'Programme fees are listed on each public programme card.'}\nScholarship, stipend, payment, and refund eligibility depends on the published programme terms.`, page:'programs', label:'View programme fees' };
  }
  if (/programme|program|internship|domain|batch|mentor|certificate|curriculum/.test(contextualQuery)) {
    const programmes = (state.programs || []).slice(0,5).map(program => `${program.title} (${program.duration}, ${program.mode})`).join('\n• ');
    return { topic:'internship programmes', text:`JNS offers mentor-guided pathways across web development, AI and machine learning, UI/UX, cloud, cybersecurity, mobile development, testing, and other technology domains. Featured options include:\n• ${programmes || 'Full-Stack Engineering, AI & Machine Learning, and UI/UX Product Design.'}`, page:'programs', label:'Explore internships' };
  }
  if (/service|software solution|web development|mobile app|cloud|cybersecurity|ui\/ux|automation/.test(contextualQuery)) {
    return { topic:'services', text:'JNS provides web development, mobile applications, custom software, AI and automation, cloud and DevOps, cybersecurity, UI/UX design, and corporate training. Services combine strategy, design, engineering, deployment, and ongoing support.', page:'services', label:'Explore services' };
  }
  if (/technolog|tech stack|tools|react|node|python|java|aws|docker|figma/.test(contextualQuery)) {
    return { topic:'technologies', text:'The public technology stack highlights HTML5, CSS3, JavaScript, React, Node.js, Java, Python, PostgreSQL, AWS, Docker, GitHub, and Figma. Technologies are selected to fit each product, learning pathway, and maintenance need.', page:'services', label:'View technology services' };
  }
  if (/project|case stud|internnexus crm|workplace assistant|asset portal/.test(contextualQuery)) {
    return { topic:'projects', text:'Featured work includes the InternNexus CRM, an AI Workplace Assistant, and a Smart Asset Portal. These projects cover CRM automation, analytics, AI search, cloud systems, web platforms, and IoT-enabled operations.', page:'projects', label:'Explore projects' };
  }
  if (/career|job|opening|vacan|hiring|recruit|interview|employee/.test(contextualQuery)) {
    return { topic:'careers', text:'JNS publishes opportunities across engineering, AI, design, QA, HR, mentoring, and support. The public site currently highlights a Frontend Engineer role in the Product Team in Chennai with a hybrid arrangement. The recruitment journey can include screening, assessment, interview, offer, verification, and onboarding; availability may change.', page:'careers', label:'View careers' };
  }
  if (/contact|email|phone|address|location|office|human support|coordinator/.test(contextualQuery)) {
    return { topic:'contact', text:'JNS is based in Chennai, Tamil Nadu. Public contact details are hello@jns.com and +91 98765 43210. Business hours are Monday to Friday, 9:00 AM–6:00 PM. Use the Contact page to reach Sales, Internships, HR, Accounts, Technical Support, or Partnerships.', page:'contact', label:'Contact JNS' };
  }
  if (/support|help|issue|problem|complaint|faq|grievance/.test(contextualQuery)) {
    return { topic:'support', text:'The Help & Support area covers applications, payments, documents, CRM login, attendance, certificates, events, careers, technical issues, complaints, and accessibility. You can raise a request and receive a reference for follow-up.', page:'support', label:'Open Help & Support' };
  }
  if (/crm|internnexus|attendance|work log|task|dashboard/.test(contextualQuery)) {
    return { topic:'CRM features', text:'Publicly described InternNexus CRM features include internship operations, applications, attendance, tasks, work logs, meetings, projects, progress, performance, documents, support, reporting, and role-based access. Access is provided only to verified users; I can’t access or reveal private CRM records.', page:'support', label:'Get CRM help' };
  }
  if (/policy|privacy|terms|security|refund rule|code of conduct/.test(contextualQuery)) {
    return { topic:'public policies', text:'Public policies and programme terms are available through the relevant application, resource, and support areas. They may cover privacy, payment and refund terms, attendance, conduct, documents, and security. For a policy not published on the site, contact JNS Support rather than relying on assumptions.', page:'resources', label:'Open resources' };
  }
  if (/event|workshop|webinar|hackathon|training/.test(contextualQuery)) {
    return { topic:'events', text:'JNS hosts workshops, webinars, hackathons, technical seminars, orientations, and training programmes. Event pages provide schedules, mode, registration, resources, certificates, and recordings when available.', page:'events', label:'Explore events' };
  }
  if (/about|company|jns private|mission|vision|what is jns/.test(contextualQuery)) {
    return { topic:'about JNS', text:'JNS Private Limited is a technology and talent-development company in Chennai. It builds dependable digital products and runs industry-focused, mentor-guided internship programmes. Its public mission connects reliable solutions with practical learning and career readiness.', page:'about', label:'About JNS' };
  }
  return { topic:lastTopic, text:'I’m primarily designed to answer questions about JNS, its services, internships, applications, projects, careers, CRM features, events, and support. I don’t have verified information for that question. Please rephrase it in a JNS context or contact the team.', page:'contact', label:'Contact the JNS team' };
}

export function bindAiAssistant(state, render) {
  const panel = document.querySelector('.ai-chat');
  const launcher = document.querySelector('.ai-fab');
  if (!panel || !launcher) return;
  state.publicChat ||= [{ ...welcomeMessage }];
  const messages = panel.querySelector('[data-ai-messages]');
  const form = panel.querySelector('.ai-chat-form');
  const input = form.querySelector('input');
  let pendingQuestion = '';

  const renderMessages = (typing = false) => {
    messages.replaceChildren();
    state.publicChat.forEach(message => {
      const bubble = document.createElement('div');
      bubble.className = `ai-message ${message.role}`;
      const text = document.createElement('p');
      text.textContent = message.text;
      bubble.append(text);
      if (message.page) {
        const link = document.createElement('button');
        link.type = 'button';
        link.dataset.aiNav = message.page;
        link.textContent = `${message.label} →`;
        bubble.append(link);
      }
      if (message.error) {
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.dataset.aiRetry = 'true';
        retry.textContent = 'Retry';
        bubble.append(retry);
      }
      messages.append(bubble);
    });
    if (typing) {
      const indicator = document.createElement('div');
      indicator.className = 'ai-message assistant ai-typing';
      indicator.setAttribute('aria-label', 'JNS AI is typing');
      indicator.innerHTML = '<i></i><i></i><i></i>';
      messages.append(indicator);
    }
    messages.scrollTop = messages.scrollHeight;
  };

  const ask = question => {
    const cleaned = question.trim();
    if (!cleaned) return;
    pendingQuestion = cleaned;
    state.publicChat.push({ role:'user', text:cleaned });
    input.value = '';
    input.disabled = true;
    form.querySelector('button').disabled = true;
    renderMessages(true);
    setTimeout(() => {
      try {
        const answer = answerQuestion(cleaned, state);
        state.publicChatTopic = answer.topic;
        state.publicChat.push({ role:'assistant', ...answer });
      } catch {
        state.publicChat.push({ role:'assistant', text:'I couldn’t prepare that answer. Please retry or contact JNS Support.', error:true });
      }
      input.disabled = false;
      form.querySelector('button').disabled = false;
      renderMessages();
      input.focus();
    }, 520);
  };

  renderMessages();
  launcher.addEventListener('click', () => {
    state.publicChatOpen = true;
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    input.focus();
  });
  panel.querySelector('[data-ai-minimise]').addEventListener('click', () => {
    state.publicChatOpen = false;
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  });
  panel.querySelector('[data-ai-clear]').addEventListener('click', () => {
    state.publicChat = [{ ...welcomeMessage }];
    state.publicChatTopic = '';
    renderMessages();
  });
  panel.querySelectorAll('[data-ai-question]').forEach(button => button.addEventListener('click', () => ask(button.dataset.aiQuestion)));
  form.addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  panel.addEventListener('click', event => {
    const navigation = event.target.closest('[data-ai-nav]');
    if (navigation) {
      state.publicPage = navigation.dataset.aiNav;
      state.publicChatOpen = false;
      scrollTo(0, 0);
      render();
      return;
    }
    if (event.target.closest('[data-ai-retry]')) {
      state.publicChat = state.publicChat.filter(message => !message.error);
      ask(pendingQuestion);
    }
  });
}
