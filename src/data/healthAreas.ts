import { HealthAreas } from '../types/types';
import {
  DumbbellIcon,
  BrainIcon,
  PiggyBankIcon,
  HeartIcon,
  BriefcaseIcon,
  UsersIcon,
  StarIcon,
  ShieldIcon,
} from '../icons';

// Configuração das áreas de saúde com tarefas do livro
export const healthAreas: HealthAreas = {
  fisica: {
    name: 'Saúde Física',
    icon: DumbbellIcon,
    color: 'bg-green-500',
    medalName: 'Corpo em Ação',
    medalIcon: '🏃',
    bookTasks: [
      'Manter horário fixo de sono (ex: 23h às 6h)',
      'Criar ritual noturno 1h antes de dormir',
      'Praticar mindful eating - comer devagar',
      'Fazer atividade física prazerosa por 20min',
      'Praticar respiração consciente por 5min',
      'Aplicar dicotomia do controle em situação de estresse',
      'Consumir alimentos ricos em fibras',
      'Parar de comer aos 80% de saciedade'
    ],
    motivationalPhrases: [
      'Seu corpo é seu templo, cuide dele com amor!',
      'Cada movimento é um passo em direção à vitalidade!',
      'A disciplina de hoje é a liberdade de amanhã!',
      'Pequenos hábitos, grandes transformações!'
    ]
  },
  mental: {
    name: 'Saúde Mental',
    icon: BrainIcon,
    color: 'bg-blue-500',
    medalName: 'Mente de Aço',
    medalIcon: '🧠',
    bookTasks: [
      'Praticar dicotomia do controle - focar no controlável',
      'Questionar julgamentos emocionais perturbadores',
      'Manter vigilância sobre pensamentos automáticos',
      'Meditar 10min para regulação emocional',
      'Contemplar adversidades com calma (premeditatio malorum)',
      'Reflexão tripla: Epicuro + Kaizen + Estoicismo',
      'Identificar prazer excessivo ou simples negligenciado',
      'Escolher 1 pequeno hábito para melhorar (1%)'
    ],
    motivationalPhrases: [
      'Sua mente é seu maior poder, domine-a!',
      'Pensamentos são nuvens, você é o céu!',
      'A serenidade vem da sabedoria interior!',
      'Cada respiração consciente é um ato de liberdade!'
    ]
  },
  financeira: {
    name: 'Saúde Financeira',
    icon: PiggyBankIcon,
    color: 'bg-yellow-500',
    medalName: 'Guardião da Carteira',
    medalIcon: '💰',
    bookTasks: [
      'Praticar pausa de 24h antes de compras não essenciais',
      'Registrar todos os gastos do dia',
      'Transferir valor automático para poupança',
      'Identificar viés financeiro em decisão recente',
      'Revisar orçamento mensal (regra 50/30/20)',
      'Estudar finanças por 30min (artigo/podcast)',
      'Avaliar progresso da reserva de emergência',
      'Listar dívidas por taxa de juros'
    ],
    motivationalPhrases: [
      'Cada real poupado é um passo rumo à liberdade!',
      'Disciplina financeira hoje, tranquilidade amanhã!',
      'Você é o CEO da sua vida financeira!',
      'Pequenas economias, grandes conquistas!'
    ]
  },
  familiar: {
    name: 'Saúde Familiar',
    icon: HeartIcon,
    color: 'bg-red-500',
    medalName: 'Coração Conectado',
    medalIcon: '❤️',
    bookTasks: [
      'Praticar CNV: Observação + Sentimento + Necessidade + Pedido',
      'Escuta ativa: guardar celular, manter contato visual',
      'Dedicar 15min de tempo de qualidade sem distrações',
      'Expressar afeto: toque, elogio, atenção, mimo ou serviço',
      'Compartilhar sentimento/desafio real (vulnerabilidade)',
      'Comunicar limite de forma assertiva e respeitosa',
      'Refletir sobre meu estilo de apego',
      'Validar sentimentos do outro sem julgar'
    ],
    motivationalPhrases: [
      'O amor se multiplica quando é compartilhado!',
      'Cada conversa é uma oportunidade de conexão!',
      'Família é onde o coração encontra seu lar!',
      'Pequenos gestos, grandes vínculos!'
    ]
  },
  profissional: {
    name: 'Saúde Profissional',
    icon: BriefcaseIcon,
    color: 'bg-purple-500',
    medalName: 'Mestre do Saber',
    medalIcon: '📚',
    bookTasks: [
      'Refletir: meu trabalho tem significado maior?',
      'Alinhar uma ação do trabalho aos meus valores',
      'Estudar habilidade-chave por 30min',
      'Aplicar dicotomia do controle no trabalho',
      'Monitorar níveis de energia e humor (burnout)',
      'Usar técnica Pomodoro para trabalho focado',
      'Criar separação clara trabalho-vida pessoal',
      'Imaginar meu epitáfio profissional desejado'
    ],
    motivationalPhrases: [
      'Seu trabalho é sua contribuição para o mundo!',
      'Cada habilidade desenvolvida é um investimento em você!',
      'Propósito transforma trabalho em vocação!',
      'Excelência é um hábito, não um ato!'
    ]
  },
  social: {
    name: 'Saúde Social',
    icon: UsersIcon,
    color: 'bg-indigo-500',
    medalName: 'Alma Conectada',
    medalIcon: '🤝',
    bookTasks: [
      'Buscar interação social positiva (abraço, conversa)',
      'Dedicar tempo de qualidade a pessoa próxima',
      'Praticar escuta ativa: ouvir para compreender',
      'Compartilhar pensamento/sentimento real',
      'Ser proativo: enviar mensagem ou marcar encontro',
      'Expressar gratidão específica a alguém',
      'Usar CNV em conflito: problema, não pessoa',
      'Identificar e comunicar limite social'
    ],
    motivationalPhrases: [
      'Conexões autênticas nutrem a alma!',
      'Cada conversa é uma ponte entre corações!',
      'Você é parte de uma rede de amor e apoio!',
      'Pequenos gestos, grandes amizades!'
    ]
  },
  espiritual: {
    name: 'Saúde Espiritual',
    icon: StarIcon,
    color: 'bg-amber-500',
    medalName: 'Luz Interior',
    medalIcon: '✨',
    bookTasks: [
      'Meditar/mindfulness por 10min',
      'Refletir sobre valores e propósito de vida',
      'Passar tempo consciente na natureza',
      'Praticar gratidão: listar 3 bênçãos do dia',
      'Autoexploração: o que espiritualidade significa?',
      'Escolher prática espiritual para focar',
      'Registrar experiência interna da prática',
      'Ler texto inspirador ou filosófico'
    ],
    motivationalPhrases: [
      'Sua luz interior ilumina o caminho!',
      'Cada momento de gratidão é uma oração!',
      'Você é parte de algo maior e sagrado!',
      'A paz interior é seu maior tesouro!'
    ]
  },
  preventiva: {
    name: 'Saúde Preventiva',
    icon: ShieldIcon,
    color: 'bg-teal-500',
    medalName: 'Protetor da Saúde',
    medalIcon: '🛡️',
    bookTasks: [
      'Monitorar sinais de alerta (estresse, fadiga)',
      'Praticar autocompaixão com erros/dificuldades',
      'Avaliar equilíbrio geral entre áreas de saúde',
      'Celebrar pequena vitória do dia',
      'Identificar área negligenciada para atenção',
      'Buscar ajuda profissional se necessário',
      'Fazer check-up preventivo agendado',
      'Aplicar PDCA: Planejar-Executar-Verificar-Agir'
    ],
    motivationalPhrases: [
      'Prevenção é o melhor remédio!',
      'Cuidar de si é um ato de amor próprio!',
      'Sua saúde é seu bem mais precioso!',
      'Pequenos cuidados, grande proteção!'
    ]
  }
}

// Frases motivacionais gerais baseadas no livro
export const generalMotivationalPhrases = [
  'Pequenos passos levam a grandes jornadas!',
  'Hoje melhor que ontem, amanhã melhor que hoje!',
  'A virtude está na ação, não na intenção!',
  'Cada escolha é uma oportunidade de crescer!',
  'O Kaizen transforma sonhos em realidade!',
  'Sua jornada extraordinária começa agora!',
  'A serenidade vem da sabedoria em ação!',
  'Você tem o poder de transformar sua vida!'
]
