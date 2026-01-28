-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL DEFAULT 'contacto@podologiaconi.cl',
    "phone" TEXT NOT NULL DEFAULT '+56 9 XXXX XXXX',
    "address" TEXT NOT NULL DEFAULT 'Consulta en...',
    "instagram" TEXT,
    "facebook" TEXT,
    "whatsapp" TEXT,
    "heroTitle" TEXT NOT NULL DEFAULT 'Podología Clínica Integral',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Recupera la salud y belleza de tus pies con atención profesional personalizada.',
    "heroButtonText" TEXT NOT NULL DEFAULT 'Agenda tu Hora',
    "aboutTitle" TEXT NOT NULL DEFAULT 'Hola, soy Constanza Cortés',
    "aboutText" TEXT NOT NULL DEFAULT 'Podóloga clínica certificada con experiencia en el tratamiento de diversas patologías del pie. Mi compromiso es brindar una atención de calidad, segura y empática.',
    "aboutImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessCase" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageBefore" TEXT,
    "imageAfter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuccessCase_pkey" PRIMARY KEY ("id")
);
