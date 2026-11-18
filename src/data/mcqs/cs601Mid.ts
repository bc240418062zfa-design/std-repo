import { McqSet } from '../../types';

export const cs601Mid: McqSet = {
  id: 'cs601-midterm',
  courseCode: 'CS601',
  courseTitle: 'Data Communication',
  term: 'midterm',
  termLabel: 'Mid-Term',
  description: 'TCP/IP model, signals, line coding, ASK/FSK/QAM, PCM sampling, multiplexing, switching, Ethernet MAC, ALOHA/CSMA, and wireless links.',
  topics: [
    'Communication Fundamentals',
    'Network Models',
    'Signals and Performance',
    'Encoding and Modulation',
    'Sampling and PCM',
    'Multiplexing',
    'Switching and Topology',
    'Transmission Media',
    'Ethernet and MAC',
    'Medium Access Control',
    'Multiple Access',
    'Telephone and Wireless'
  ],
  questions: [
    {
      id: 'cs601-mid-1',
      num: 1,
      topic: 'Communication Fundamentals',
      question: 'Which component of a data communication system governs the overall communication between devices?',
      options: ['Transmission medium', 'Receiver', 'Protocol', 'Sender'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-2',
      num: 2,
      topic: 'Communication Fundamentals',
      question: 'In a data communication system, the device that sends the data is called the:',
      options: ['Receiver', 'Sender', 'Protocol', 'Medium'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-3',
      num: 3,
      topic: 'Communication Fundamentals',
      question: 'When two people talk in a room, the transmission medium between them is:',
      options: ['A cable', 'Air', 'A satellite', 'No medium'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-4',
      num: 4,
      topic: 'Communication Fundamentals',
      question: 'Which characteristic means that data must arrive at the destination in the same order in which it was sent?',
      options: ['Delivery', 'Accuracy', 'Timeliness', 'Jitter'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-5',
      num: 5,
      topic: 'Communication Fundamentals',
      question: 'A telephone conversation is an example of which direction of data flow?',
      options: ['Simplex', 'Half-duplex', 'Full-duplex', 'Multiplexed'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-6',
      num: 6,
      topic: 'Network Models',
      question: 'How many layers are in the TCP/IP protocol suite as commonly presented in CS601?',
      options: ['3', '4', '5', '7'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-7',
      num: 7,
      topic: 'Network Models',
      question: 'The most upper layer of the TCP/IP model is the:',
      options: ['Network layer', 'Transport layer', 'Application layer', 'Data-link layer'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-8',
      num: 8,
      topic: 'Network Models',
      question: 'In the TCP/IP model, the physical layer exchanges data in the form of:',
      options: ['Packets', 'Frames', 'Bits', 'Segments'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-9',
      num: 9,
      topic: 'Network Models',
      question: 'The address used by the transport layer is usually in the form of:',
      options: ['Logical address', 'Port number', 'MAC address', 'Physical address'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-10',
      num: 10,
      topic: 'Network Models',
      question: 'Routing is primarily a function of the ______ layer.',
      options: ['Physical', 'Data-link', 'Network', 'Transport'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-11',
      num: 11,
      topic: 'Signals and Performance',
      question: 'A signal that completes a pattern in a fixed amount of time is called a:',
      options: ['Periodic signal', 'Random signal', 'Digital signal', 'Noise signal'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-12',
      num: 12,
      topic: 'Signals and Performance',
      question: 'The time required by a periodic signal to complete one cycle is called its:',
      options: ['Amplitude', 'Period', 'Phase', 'Bandwidth'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-13',
      num: 13,
      topic: 'Signals and Performance',
      question: 'In a frequency-domain plot, the vertical (Y) axis normally represents:',
      options: ['Time', 'Frequency', 'Amplitude', 'Distance'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-14',
      num: 14,
      topic: 'Signals and Performance',
      question: 'The strength of a signal is commonly measured by its:',
      options: ['Amplitude', 'Period', 'Phase', 'Wavelength'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-15',
      num: 15,
      topic: 'Signals and Performance',
      question: 'Bandwidth is commonly measured in:',
      options: ['Bits per second', 'Hertz', 'Degrees', 'Volts only'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-16',
      num: 16,
      topic: 'Signals and Performance',
      question: 'If a system sends five bits in half a second, its bit rate is:',
      options: ['0.2 bps', '5 bps', '10 bps', '20 bps'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-17',
      num: 17,
      topic: 'Signals and Performance',
      question: 'Propagation time is calculated as:',
      options: [
        'Distance ÷ propagation speed',
        'Bandwidth ÷ propagation speed',
        'Delay × propagation speed',
        'Throughput ÷ distance'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-18',
      num: 18,
      topic: 'Signals and Performance',
      question: 'Thermal noise is caused by:',
      options: [
        'A sudden high-energy spike',
        'Random motion of electrons',
        'One wire affecting another',
        'A damaged connector'
      ],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-19',
      num: 19,
      topic: 'Signals and Performance',
      question: 'The effect of one wire on another nearby wire is called:',
      options: ['Thermal noise', 'Impulse noise', 'Crosstalk', 'Attenuation'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-20',
      num: 20,
      topic: 'Signals and Performance',
      question: 'Noise caused by a short-duration signal with very high energy is called:',
      options: ['Impulse noise', 'Thermal noise', 'Crosstalk', 'Induced noise'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-21',
      num: 21,
      topic: 'Encoding and Modulation',
      question: 'The process of converting binary data into a digital signal is called:',
      options: ['Line coding', 'Modulation', 'Sampling', 'Multiplexing'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-22',
      num: 22,
      topic: 'Encoding and Modulation',
      question: 'AMI is a popular ______ encoding method.',
      options: ['Unipolar', 'Polar', 'Bipolar', 'Quadrature'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-23',
      num: 23,
      topic: 'Encoding and Modulation',
      question: 'A bipolar encoding scheme uses how many voltage levels?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-24',
      num: 24,
      topic: 'Encoding and Modulation',
      question: 'A unipolar encoding scheme uses:',
      options: ['One voltage level', 'Two opposite voltage levels', 'Three voltage levels', 'Four voltage levels'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-25',
      num: 25,
      topic: 'Encoding and Modulation',
      question: 'In which encoding scheme are all signal levels on one side of the time axis?',
      options: ['Polar', 'Bipolar', 'Unipolar', 'Manchester'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-26',
      num: 26,
      topic: 'Encoding and Modulation',
      question: 'Manchester encoding provides synchronization similar to:',
      options: ['RZ', 'NRZ', 'Differential Manchester', 'AMI'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-27',
      num: 27,
      topic: 'Encoding and Modulation',
      question: 'In amplitude-shift keying (ASK), which signal property is changed?',
      options: ['Amplitude', 'Frequency', 'Phase', 'Wavelength'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-28',
      num: 28,
      topic: 'Encoding and Modulation',
      question: 'BFSK stands for:',
      options: [
        'Binary Frequency Shift Keying',
        'Baud Frequency Shift Keying',
        'Binary Frame Shift Keying',
        'Bridge Frequency Shift Keying'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-29',
      num: 29,
      topic: 'Encoding and Modulation',
      question: 'QAM stands for:',
      options: [
        'Quadrature Amplitude Modulation',
        'Quadrature Amplitude Modifier',
        'Quick Analog Modulation',
        'Quadratic Analog Multiplexing'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-30',
      num: 30,
      topic: 'Encoding and Modulation',
      question: 'Which technique is used for analog-to-digital conversion?',
      options: ['PCM', 'FM', 'AM', 'PM'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-31',
      num: 31,
      topic: 'Sampling and PCM',
      question: "In PCM, sampling can also be described as measuring the signal's:",
      options: ['Amplitude at regular time intervals', 'Frequency only', 'Cable length', 'Phase only'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-32',
      num: 32,
      topic: 'Sampling and PCM',
      question: 'The most appropriate sampling approach for PCM is based on the:',
      options: ['Nyquist sampling theorem', 'Fourier switching rule', 'ALOHA rule', 'Mesh formula'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-33',
      num: 33,
      topic: 'Sampling and PCM',
      question: 'Quantization assigns each sample to a level based mainly on its:',
      options: ['Amplitude range and required accuracy', 'Cable category', 'Port number', 'Propagation distance'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-34',
      num: 34,
      topic: 'Sampling and PCM',
      question: 'If a digital signal has L levels, the number of bits per signal level is:',
      options: ['log L', 'log₂ L', 'L²', '2L'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-35',
      num: 35,
      topic: 'Sampling and PCM',
      question: 'A digital signal is represented by:',
      options: ['Continuous values only', 'Discrete values', 'Only sound waves', 'Only analog values'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-36',
      num: 36,
      topic: 'Multiplexing',
      question: "Which multiplexing technique divides a link's bandwidth into frequency bands?",
      options: ['TDM', 'FDM', 'WDM', 'CDM'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-37',
      num: 37,
      topic: 'Multiplexing',
      question: 'In TDM, each station is allocated a:',
      options: ['Frequency band', 'Time slot', 'MAC address', 'Wavelength only'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-38',
      num: 38,
      topic: 'Multiplexing',
      question: 'Which digital multiplexing method is used to share the high bandwidth of a fiber-optic link by using different wavelengths?',
      options: ['FDM', 'TDM', 'WDM', 'ASK'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-39',
      num: 39,
      topic: 'Multiplexing',
      question: 'In statistical TDM, slots are:',
      options: [
        'Permanently reserved for every input',
        'Dynamically allocated to active stations',
        'Assigned by frequency',
        'Used only by the receiver'
      ],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-40',
      num: 40,
      topic: 'Multiplexing',
      question: 'In synchronous TDM, the number of slots in a frame is normally related to the number of:',
      options: ['Input lines', 'Output bits only', 'Routers', 'MAC addresses'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-41',
      num: 41,
      topic: 'Multiplexing',
      question: 'How many basic categories of multiplexing are commonly discussed in data communication?',
      options: ['Two', 'Three', 'Five', 'Seven'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-42',
      num: 42,
      topic: 'Switching and Topology',
      question: 'A local telephone network traditionally uses ______ switching.',
      options: ['Packet', 'Circuit', 'Bit', 'Message'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-43',
      num: 43,
      topic: 'Switching and Topology',
      question: 'In which switching method is a dedicated path established before communication begins?',
      options: ['Circuit switching', 'Packet switching', 'Datagram switching', 'Message broadcasting'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-44',
      num: 44,
      topic: 'Switching and Topology',
      question: 'In a star topology, every computer is connected to a central:',
      options: ['Bus cable', 'Device', 'Ring', 'Satellite'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-45',
      num: 45,
      topic: 'Switching and Topology',
      question: 'Which is an example of a multipoint topology?',
      options: ['Mesh', 'Bus', 'Point-to-point link', 'Dedicated circuit'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-46',
      num: 46,
      topic: 'Switching and Topology',
      question: 'A star network with four computers connected to one switch needs how many computer-to-switch cables?',
      options: ['3', '4', '5', '6'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-47',
      num: 47,
      topic: 'Switching and Topology',
      question: 'The correct formula for the number of links in a full mesh with N devices is:',
      options: ['N(N−1)/2', 'N−1', 'N+1', 'N×N'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-48',
      num: 48,
      topic: 'Transmission Media',
      question: 'An optical-fiber cable transmits signals in the form of:',
      options: ['Electrical current', 'Light', 'Sound', 'Heat'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-49',
      num: 49,
      topic: 'Transmission Media',
      question: 'In optical fiber, the core is surrounded by:',
      options: ['Cladding', 'A second copper wire', 'A battery', 'An antenna'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-50',
      num: 50,
      topic: 'Transmission Media',
      question: 'Which guided medium has the least electromagnetic interference?',
      options: ['Unshielded twisted pair', 'Coaxial cable', 'Fiber-optic cable', 'Thick coaxial only'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-51',
      num: 51,
      topic: 'Transmission Media',
      question: 'The medium used by 10Base-T Ethernet is:',
      options: ['Thick coaxial cable', 'Thin coaxial cable', 'Twisted-pair cable', 'Fiber only'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-52',
      num: 52,
      topic: 'Transmission Media',
      question: '10Base5 Ethernet uses:',
      options: ['Thick coaxial cable', 'Thin coaxial cable', 'Twisted pair', 'Single-mode fiber'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-53',
      num: 53,
      topic: 'Transmission Media',
      question: 'The common connector for twisted-pair Ethernet cable is:',
      options: ['RJ-11', 'RJ-45', 'RJ-54', 'BNC only'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-54',
      num: 54,
      topic: 'Transmission Media',
      question: 'Coaxial cables are categorized by their ______ ratings.',
      options: ['AM', 'FM', 'RG', 'QAM'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-55',
      num: 55,
      topic: 'Ethernet and MAC',
      question: 'The original Ethernet data rate of 10 Mbps is called:',
      options: ['Standard Ethernet', 'Fast Ethernet', 'Gigabit Ethernet', '10-Gigabit Ethernet'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-56',
      num: 56,
      topic: 'Ethernet and MAC',
      question: 'Fast Ethernet has a data rate of:',
      options: ['10 Mbps', '100 Mbps', '1,000 Mbps', '10,000 Mbps'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-57',
      num: 57,
      topic: 'Ethernet and MAC',
      question: 'Gigabit Ethernet provides a data rate of:',
      options: ['10 Mbps', '100 Mbps', '1 billion bits per second', '10 billion bytes per second'],
      correctIndex: 2
    },
    {
      id: 'cs601-mid-58',
      num: 58,
      topic: 'Ethernet and MAC',
      question: 'A computer or workstation on an Ethernet network must have a:',
      options: ['NIC', 'TDI', 'DSL modem only', 'POP card'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-59',
      num: 59,
      topic: 'Ethernet and MAC',
      question: 'The length of a standard Ethernet MAC address is:',
      options: ['24 bits', '36 bits', '42 bits', '48 bits'],
      correctIndex: 3
    },
    {
      id: 'cs601-mid-60',
      num: 60,
      topic: 'Ethernet and MAC',
      question: 'In an Ethernet frame, the destination and source addresses are each:',
      options: ['1 byte', '2 bytes', '4 bytes', '6 bytes'],
      correctIndex: 3
    },
    {
      id: 'cs601-mid-61',
      num: 61,
      topic: 'Ethernet and MAC',
      question: 'In hexadecimal notation, bytes in an Ethernet address are commonly separated by:',
      options: ['A colon', 'A question mark', 'An underscore', 'A hash'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-62',
      num: 62,
      topic: 'Ethernet and MAC',
      question: 'The source address in an Ethernet frame is normally a ______ address.',
      options: ['Unicast', 'Multicast', 'Broadcast', '128-bit'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-63',
      num: 63,
      topic: 'Medium Access Control',
      question: 'Which of the following is a random-access protocol?',
      options: ['ALOHA', 'TDMA', 'Polling', 'Token passing'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-64',
      num: 64,
      topic: 'Medium Access Control',
      question: 'The main drawback of the original ALOHA method is:',
      options: ['No data is sent', 'Potential collisions', 'It requires fiber', 'It uses port numbers'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-65',
      num: 65,
      topic: 'Medium Access Control',
      question: 'In pure ALOHA, the vulnerable time is:',
      options: [
        'Equal to one frame time',
        'Two times the frame transmission time',
        'Half a frame time',
        'Four frame times'
      ],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-66',
      num: 66,
      topic: 'Medium Access Control',
      question: 'In slotted ALOHA, a station may begin transmission only:',
      options: [
        'At the beginning of a time slot',
        'At any random instant',
        'After a token arrives',
        'After polling'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-67',
      num: 67,
      topic: 'Medium Access Control',
      question: 'CSMA/CD detects a collision by:',
      options: [
        'Monitoring the medium while transmitting',
        'Waiting for a token',
        'Using a frequency band',
        'Encrypting the frame'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-68',
      num: 68,
      topic: 'Medium Access Control',
      question: 'Collisions in CSMA/CA are reduced using:',
      options: [
        'Interframe space, contention window, and acknowledgements',
        'Only a MAC address',
        'Only frequency division',
        'Only circuit switching'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-69',
      num: 69,
      topic: 'Medium Access Control',
      question: 'Which is a controlled-access method?',
      options: ['Reservation', 'Polling', 'Token passing', 'All of these'],
      correctIndex: 3
    },
    {
      id: 'cs601-mid-70',
      num: 70,
      topic: 'Medium Access Control',
      question: 'In token passing, possession of the token gives a station the right to:',
      options: ['Send data', 'Delete data', 'Change the MAC address', 'Receive every frame'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-71',
      num: 71,
      topic: 'Medium Access Control',
      question: 'Polling works with a topology in which one device is the primary station and other devices are:',
      options: ['Secondary stations', 'Routers only', 'Servers only', 'Wireless stations only'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-72',
      num: 72,
      topic: 'Multiple Access',
      question: 'In FDMA, each station is assigned a separate:',
      options: ['Time slot', 'Frequency band', 'MAC address', 'Token'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-73',
      num: 73,
      topic: 'Multiple Access',
      question: 'In TDMA, stations share the medium by using separate:',
      options: ['Frequency bands', 'Time slots', 'Light wavelengths only', 'IP addresses'],
      correctIndex: 1
    },
    {
      id: 'cs601-mid-74',
      num: 74,
      topic: 'Multiple Access',
      question: 'In CDMA, an idle station is represented by:',
      options: ['0', '1', '−1 only', 'Infinity'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-75',
      num: 75,
      topic: 'Telephone and Wireless',
      question: 'POTS stands for:',
      options: [
        'Plain Old Telephone Service',
        'Private Optical Transfer System',
        'Packet-Oriented Telephone Switching',
        'Plain Online Telecom Signal'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-76',
      num: 76,
      topic: 'Telephone and Wireless',
      question: 'DSL stands for:',
      options: [
        'Digital Subscriber Line',
        'Data Switched Link',
        'Digital Signal Layer',
        'Direct Service Line'
      ],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-77',
      num: 77,
      topic: 'Telephone and Wireless',
      question: 'POP in a telephone network stands for:',
      options: ['Point of Presence', 'Protocol of Packet', 'Port of Provider', 'Proof of Purchase'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-78',
      num: 78,
      topic: 'Telephone and Wireless',
      question: 'A parabolic antenna is commonly used for:',
      options: ['Microwave communication', 'Underwater sound', 'Copper signaling', 'Thermal noise'],
      correctIndex: 0
    },
    {
      id: 'cs601-mid-79',
      num: 79,
      topic: 'Telephone and Wireless',
      question: 'Electromagnetic waves in the approximate range from 0 Hz to 300 GHz are called:',
      options: ['Radio waves', 'Only infrared waves', 'Only visible light', 'Ultrasound'],
      correctIndex: 0
    }
  ]
};
