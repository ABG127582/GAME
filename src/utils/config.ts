import {
    DumbbellIcon, BrainIcon, PiggyBankIcon, HeartIcon, BriefcaseIcon, UsersIcon, CompassIcon,
    FlameIcon, ShieldIcon, CheckCircle2Icon, AwardIcon, MusicIcon, CloudRainIcon, TreePineIcon, WavesIcon
} from '../components/Icons';

export const healthAreas = {
  physical: { name: 'Saúde Física', icon: DumbbellIcon, color: 'var(--accent-green-500)' },
  mental: { name: 'Saúde Mental', icon: BrainIcon, color: 'var(--accent-blue-500)' },
  financial: { name: 'Saúde Financeira', icon: PiggyBankIcon, color: 'var(--accent-yellow-500)' },
  family: { name: 'Saúde Familiar', icon: HeartIcon, color: 'var(--accent-red-500)' },
  professional: { name: 'Saúde Profissional', icon: BriefcaseIcon, color: 'var(--accent-purple-500)' },
  social: { name: 'Saúde Social', icon: UsersIcon, color: 'var(--accent-indigo-500)' },
  spiritual: { name: 'Saúde Espiritual', icon: CompassIcon, color: 'var(--accent-teal-500)' },
};

export const bookInspiredTasks: Record<keyof typeof healthAreas, string[]> = {
    physical: [
        "Expor-se a 10 minutos de luz solar da manhã logo ao acordar.",
        "Agendar o relaxamento como uma reunião importante (10 min de respiração ou caminhada).",
        "Fazer uma rotina de exercícios de força 2-3 vezes na semana.",
        "Verificar seus níveis de Vitamina D ou tomar sol por 15 minutos com segurança.",
    ],
    mental: [
        "Praticar a 'Pausa de Um Minuto' para observar a respiração.",
        "Fazer uma caminhada leve de 15 minutos, especialmente após uma noite mal dormida.",
        "Identificar uma emoção difícil e perguntar: 'Minha resposta está sob meu controle?'",
        "Praticar autocompaixão após cometer um erro, dizendo a si mesmo 'sofrer é parte de ser humano'.",
    ],
    financial: [
        "Registrar todos os seus gastos por uma semana, sem julgamento, apenas observando.",
        "Automatizar a transferência de um pequeno valor (ex: R$ 50) para sua reserva de emergência.",
        "Ler um artigo ou assistir a um vídeo sobre um tipo de investimento para iniciantes.",
        "Revisar seu orçamento usando a regra 50-15-35 como um guia.",
    ],
    family: [
        "Escolher uma das 5 linguagens do amor (Toque, Elogio, Atenção, Mimos, Obrigações) e praticá-la intencionalmente.",
        "Na próxima conversa difícil, ouvir para entender, em vez de para responder.",
        "Surpreender um familiar com um pequeno gesto, como preparar um café ou deixar um bilhete.",
        "Desligar o celular e dar atenção total durante uma conversa com um ente querido.",
    ],
    professional: [
        "Refletir sobre as quatro perguntas do Ikigai: O que você ama? No que você é bom? Do que o mundo precisa? Pelo que você pode ser pago?",
        "Dedicar 20 minutos para 'prática deliberada' de uma nova habilidade profissional.",
        "Fazer uma 'auditoria de energia' semanal, revisando os sete territórios da sua vida.",
        "Criar um ritual de 'desligar' ao final do dia de trabalho, como uma caminhada ou guardar o laptop.",
    ],
    social: [
        "Enviar uma mensagem significativa para alguém da sua 'Tribo Íntima' (3 a 5 pessoas mais próximas).",
        "Compartilhar algo um pouco mais pessoal (um desafio ou sentimento real) com um amigo de confiança.",
        "Juntar-se a um curso, clube do livro ou grupo de corrida sobre algo que você ama.",
        "Fazer uma 'primeira micro-interação': um elogio sincero ou uma pergunta sobre um interesse em comum a alguém novo.",
    ],
    spiritual: [
        "Reservar 5 minutos para meditação, focando apenas na sua respiração.",
        "Antes de dormir, anotar uma coisa pela qual você foi genuinamente grato hoje.",
        "Buscar admiração ('awe'): caminhar na natureza, olhar para as estrelas ou ouvir uma música emocionante.",
        "Envolver-se em um pequeno ato de serviço para sua comunidade.",
    ],
};

export const trophies = {
  'streak-7': { name: 'Sequência de 7 Dias', description: 'Complete ao menos uma tarefa por 7 dias seguidos.', icon: FlameIcon, color: 'var(--trophy-bronze)' },
  'streak-30': { name: 'Mestre da Consistência', description: 'Complete ao menos uma tarefa por 30 dias seguidos.', icon: FlameIcon, color: 'var(--trophy-silver)' },
  'tasks-100': { name: 'Centurião de Tarefas', description: 'Complete 100 tarefas no total.', icon: ShieldIcon, color: 'var(--trophy-bronze)' },
  'tasks-500': { name: 'Lenda Produtiva', description: 'Complete 500 tarefas no total.', icon: ShieldIcon, color: 'var(--trophy-gold)' },
  'perfect-week': { name: 'Semana Perfeita', description: 'Complete todas as tarefas de uma semana.', icon: CheckCircle2Icon, color: 'var(--trophy-silver)' },
  'area-master': { name: 'Mestre de Área', description: 'Complete 50 tarefas em uma única área.', icon: AwardIcon, color: 'var(--trophy-gold)' },
};

export const focusMusicTracks = [
  { id: 'lofi', name: 'Lofi Beats', icon: MusicIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/lofi-study-112191.mp3' },
  { id: 'rain', name: 'Chuva Relaxante', icon: CloudRainIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/rain-and-thunder-166243.mp3' },
  { id: 'forest', name: 'Sons da Floresta', icon: TreePineIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/forest-with-small-river-birds-and-nature-field-recording-141893.mp3' },
  { id: 'waves', name: 'Ondas do Mar', icon: WavesIcon, url: 'https://storage.googleapis.com/pequenos-passos-bucket/waves-and-sand-84522.mp3' },
];

export const stretchingExercises = [
    { id: 1, name: 'Alongamento de Pescoço', description: 'Incline a cabeça para cada lado, segurando por 30 segundos. Ajuda a aliviar a tensão nos ombros.', duration: 60 },
    { id: 2, name: 'Alongamento de Ombros', description: 'Cruze um braço sobre o peito e puxe suavemente com o outro. Repita para o outro lado.', duration: 60 },
    { id: 3, name: 'Alongamento de Gato-Vaca', description: 'Em quatro apoios, arqueie e curve as costas lentamente. Ótimo para a mobilidade da coluna.', duration: 90 },
    { id: 4, name: 'Alongamento de Isquiotibiais', description: 'Sentado, estique uma perna e tente alcançar o pé. Mantenha as costas retas.', duration: 120 },
    { id: 5, name: 'Alongamento de Quadril', description: 'Em uma posição de afundo, incline-se para a frente para sentir o alongamento no flexor do quadril.', duration: 120 },
    { id: 6, name: 'Torção de Coluna Deitado', description: 'Deitado de costas, traga um joelho em direção ao peito e, em seguida, cruze-o sobre o corpo.', duration: 90 },
];

export const avatars = ['😊', '😎', '🚀', '🧠', '💪', '🌱', '🏆', '🧘', '🦊', '🦉', '🌟', '💡'];