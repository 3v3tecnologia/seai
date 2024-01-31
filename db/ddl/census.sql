CREATE DATABASE census;

\c census;

CREATE EXTENSION postgis;


CREATE TABLE "Bacias" (
	"Id" SERIAL PRIMARY KEY,
	"Bacia" VARCHAR(50)
);
COPY "Bacias"("Bacia")
FROM '/var/lib/postgres/data/Bacias.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "Municipios" (
	"Id" SERIAL PRIMARY KEY,
	"Bacia_Id" INTEGER REFERENCES "Bacias"("Id"),
	"Municipio" VARCHAR(50)
);
COPY "Municipios"("Bacia_Id",
	"Municipio")
FROM '/var/lib/postgres/data/Municipios.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "Contatos" (
	"Id" SERIAL PRIMARY KEY,
	"Endereço" VARCHAR(100),
	"Complemento" VARCHAR(100),
	"Email" VARCHAR(50),
	"Municipio_Id" INTEGER REFERENCES "Municipios"("Id"),
	"Numero" VARCHAR(20),
	"Bairro" VARCHAR(50),
	-- "CEP" VARCHAR(12),
	"Telefone" VARCHAR(30)
);

COPY "Contatos"("Endereço", --B0004
	"Complemento", --B0005
	"Email", --B0006
	"Municipio_Id", --B0007
	"Numero", --B0008
	"Bairro", --B0009
	"Telefone") --B0010
FROM '/var/lib/postgres/data/Contatos.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "EmpresasPocos" (
	"Id" SERIAL PRIMARY KEY,
	"Localizacao_Id" INTEGER NOT NULL REFERENCES "Contatos"("Id"),
	"Empresa" VARCHAR(100),
	"CNPJ" VARCHAR(20),
	"Responsavel" VARCHAR(100),
	"CREA" VARCHAR(30)
);

COPY "EmpresasPocos"("Localizacao_Id", --FK
	"Empresa", --G0001
	"CNPJ", --G0002
	"Responsavel", --G0004
	"CREA") --G0005
FROM '/var/lib/postgres/data/EmpresasPocos.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE natureza_poco_enum AS ENUM(
	'Não informado',
	'Não aplicável',
	'Piezométrico',
	'Poço Tubular',
	'Poço Pinteira',
	'Poço de Monitoramento',
	'Poço Escavado-Cacimba',
	'Poço Coletor'
);

CREATE TYPE filtro_poco_enum AS ENUM(
	'Não informado',
	'Não aplicável',
	'Plástico geomecânico',
	'Plástico geomecânico reforçado',
	'Estampado galvanizado',
	'Tubo ranhura',
	'Espiral inox',
	'Espiral galvanizado',
	'Estampado',
	'PVC',
	'Sem filtro'
);

CREATE TYPE revestimento_poco_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Aço preto',
    'Aço inox',
    'Aço sem costura',
    'Aço com costura',
    'Plástico PVC',
    'PVC',
    'Galvanizado',
    'Plástico geomecânico',
    'Tubos de concreto',
    'Espiralado perfil'
);

CREATE TYPE acabamento_poco_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Equipamentos de medição de volume extraído - hidrômetro',
    'Dispositivo para coleta de amostra da água',
    'Tubo auxiliar de medição de nível',
    'Laje de proteção',
    'Nenhum identificado'
);

CREATE TABLE "Pocos" (
	"Id" SERIAL PRIMARY KEY,
	"EmpresaPerfuracao_Id" INTEGER NOT NULL REFERENCES "EmpresasPocos"("Id"),
	"NaturezaPoco" natureza_poco_enum,
	"Profundidade" REAL,
	"AlturaBoca" REAL,
	"Diametro" REAL,
	"De" REAL,
	"Ate" REAL,
	"DataInstalacao" DATE,
	"CotaTerreno" REAL,
	"Filtro" filtro_poco_enum,
	"RevestimentoDiametro" REAL,
	"Revestimento" revestimento_poco_enum,
	"Acabamento" acabamento_poco_enum
);

COPY "Pocos"("EmpresaPerfuracao_Id", --FK
	"NaturezaPoco", --G0100
	"Profundidade", --G0101
	"AlturaBoca", --G0102
	"Diametro", --G0103
	"De", --G0104
	"Ate", --G0105
	"DataInstalacao", --G0106
	"CotaTerreno", --G0108
	"Filtro", --G0110
	"RevestimentoDiametro", --G0111
	"Revestimento", --G0112
	"Acabamento") --G0113
FROM '/var/lib/postgres/data/Pocos.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "Cadastro" (
	"Id" SERIAL PRIMARY KEY,
	"Localizacao_Id" INTEGER REFERENCES "Contatos"("Id"),
	"Poco_Id" INTEGER REFERENCES "Pocos"("Id"),
	"Responsavel" VARCHAR(100),
	"NumCad"  VARCHAR(15),
	"NomeCadastrador" VARCHAR(100),
	"Obs"  VARCHAR(500)
);

COPY "Cadastro"("Localizacao_Id", --FK
	"Poco_Id", --FK
	"Responsavel", --I0000
	"NumCad", --ID
	"NomeCadastrador", --A0000
	"Obs") --I0004
FROM '/var/lib/postgres/data/Cadastro.csv' DELIMITER ';' CSV HEADER;

-- CREATE TABLE "Fotos" (
-- 	"Id" SERIAL PRIMARY KEY,
-- 	"Cad_Id" INTEGER REFERENCES "Cadastro"("Id"),
-- 	"Id_imagem" VARCHAR(20), 
-- 	"Coordenadas" GEOMETRY,
-- 	"Observacao" VARCHAR(1000)
-- );

CREATE TYPE tipo_empreendimento_enum as ENUM(
	'Não informado',
	'Não aplicável',
	'Administração Pública',
	'Agropecuária',
	'Indústria',
	'Comércio e Serviços',
	'Saneamento'
);

CREATE TABLE "PessoaJuridica" (
	"Id" SERIAL PRIMARY KEY,
	"Cad_Id" INTEGER NOT NULL REFERENCES "Cadastro"("Id"),
	"Correspondencia_Id" INTEGER REFERENCES "Contatos"("Id"),
	"Nome" VARCHAR(100),
	"NomeFantasia" VARCHAR(100),
	"InscEstadual" VARCHAR(100),
	"CNAE" VARCHAR(100),
	"NumTrabalhadores" SMALLINT,
	"TipoEmpreendimento" tipo_empreendimento_enum
);

COPY "PessoaJuridica"("Cad_Id", --FK
	"Correspondencia_Id", --FK
	"Nome", --B0000
	"NomeFantasia", --B0002
	"InscEstadual", --B0001
	"CNAE", --B0003
	"NumTrabalhadores", --x0000
	"TipoEmpreendimento") --B0100
FROM '/var/lib/postgres/data/PessoaJuridica.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "PessoaFisica" (
	"Id" SERIAL PRIMARY KEY,
	"Cad_Id" INTEGER NOT NULL REFERENCES "Cadastro"("Id"),
	"Correspondencia_Id" INTEGER REFERENCES "Contatos"("Id"),
	"Nome" VARCHAR(100),
	"RG"  VARCHAR(20),
	"CPF"  VARCHAR(20),
	"Municipio_Id"  INTEGER REFERENCES "Municipios"("Id"),
	"Cargo" VARCHAR(30),
	"NumTrabalhadores" SMALLINT
);

COPY "PessoaFisica"("Cad_Id", --FK
	"Correspondencia_Id", --FK
	"Nome", --C0000
	"RG", --C0005
	"CPF", --C0004
	"Municipio_Id",--C0007
	"Cargo", --C0002
	"NumTrabalhadores") --x0001
FROM '/var/lib/postgres/data/PessoaFisica.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE mes_enum AS ENUM
(
    'Janeiro', 
    'Fevereiro',
    'Março', 
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
);

CREATE TABLE "CaptacaoMedia" (
	"Id" SERIAL PRIMARY KEY,
	"Mes" mes_enum,
	"Vazao" REAL,
	"HorasDia" REAL,
	"DiasMes" REAL,
	"VolumeMes" REAL
);

COPY "CaptacaoMedia"("Mes", --ENUM
	"Vazao", --xx000
	"HorasDia", --xx001
	"DiasMes", --xx002
	"VolumeMes") --xx003
FROM '/var/lib/postgres/data/CaptacaoMedia.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "RecursoHidrico" (
	"Id" SERIAL PRIMARY KEY,
	"Cad_Id" INTEGER NOT NULL REFERENCES "Cadastro"("Id"),
	"Nome" VARCHAR(100),
	"Municipio_Id" INTEGER REFERENCES "Municipios"("Id"),
	"Outorga" VARCHAR(100),
	"NumOutorga" VARCHAR(100),
	"Latitude" REAL,
	"Longitude" REAL
);

COPY "RecursoHidrico"("Cad_Id", --FK
	"Nome", --D0000
	"Municipio_Id", --D0001
	"Outorga", --D0002
	"NumOutorga", --D0003
	"Latitude", --D100
	"Longitude") --D101
FROM '/var/lib/postgres/data/RecursoHidrico.csv' DELIMITER ';' CSV HEADER;

ALTER TABLE "RecursoHidrico" ADD COLUMN "Geom" geometry(POINT, 4326);
UPDATE "RecursoHidrico" SET "Geom" = ST_SetSRID(ST_MakePoint("Longitude", "Latitude") ,4326);

CREATE TABLE "Superficial" (
	"Rh_Id" INTEGER REFERENCES "RecursoHidrico"("Id"),
	"Captacao_Id" INTEGER REFERENCES "CaptacaoMedia"("Id"),
	"MinaNasc" VARCHAR(100),
	"RioCorrLago" VARCHAR(100),
	"Bacia" VARCHAR(20)
);

COPY "Superficial"("Rh_Id", --FK
	"Captacao_Id", --FK
	"MinaNasc", --D0007
	"RioCorrLago", --D0008
	"Bacia") --D0009
FROM '/var/lib/postgres/data/Superficial.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE subterraneo_tipo_enum AS ENUM(
	'Não  informado',
	'Não aplicável',
	'Cacimba ou Poço',
	'Poço tubular'
); 

CREATE TABLE "Subterranea" (
	"Rh_Id" INTEGER REFERENCES "RecursoHidrico"("Id"),
	"Captacao_Id" INTEGER REFERENCES "CaptacaoMedia"("Id"),
	"TipoSubterraneo" subterraneo_tipo_enum, 
	"Profundidade" REAL,
	"LAU" VARCHAR(20)
);

COPY "Subterranea"("Rh_Id", --FK
	"Captacao_Id", --FK
	"TipoSubterraneo", --D0004
	"Profundidade", --D0005
	"LAU") --D0006
FROM '/var/lib/postgres/data/Subterranea.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "Usos" (
	"Id" SERIAL PRIMARY KEY,
	"Cad_Id" INTEGER REFERENCES "Cadastro"("Id")
);

COPY "Usos"(
	"Cad_Id" --FK
)
FROM '/var/lib/postgres/data/Usos.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE tipo_criacao_enum AS ENUM(
	'Aves',
	'Bovinos',
	'Equinos',
	'Caprinos',
	'Ovinos',
	'Suínos',
	'Outros'
);

CREATE TABLE "Animais" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER REFERENCES "Usos"("Id"),
	"TipoCriacao" tipo_criacao_enum,
	"NumCabecasAno" INTEGER,
	"Comercializacao" REAL,
	"ConsumoPerCapita" REAL
);

COPY "Animais"(
	"Usos_Id", --FK
	"TipoCriacao", --ENUM
	"NumCabecasAno", --H05xx
	"Comercializacao", --H05xx
	"ConsumoPerCapita") --H05xx
FROM '/var/lib/postgres/data/Animais.csv' DELIMITER ';' CSV HEADER;


CREATE TABLE "Irrigacao" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER REFERENCES "Usos"("Id"),
	"UsoReservatorio" BOOLEAN DEFAULT NULL,
	"AreaLamina" REAL,
	"ProfMedia" REAL,
	"Rentabilidade" REAL
);

COPY "Irrigacao"("Usos_Id", --FK
	"UsoReservatorio", --H0320
	"AreaLamina", --H0321
	"ProfMedia", --H0322
	"Rentabilidade") --H0323
FROM '/var/lib/postgres/data/Irrigacao.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE tipo_provedor_enum AS ENUM(
	'Não informado',
	'Não aplicável',
	'Administração direta (prefeitura)',
	'Administração indireta (SAAE ou similares)',
	'Autorizada (associações, cooperativas)',
	'Concessionária (estaduais, empresa privada)'
);

CREATE TABLE "Saneamento" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"Entidade" VARCHAR(200),
	"Distrito" VARCHAR(200),
	"Municipio_Id" INTEGER REFERENCES "Municipios"("Id"),
	"VazaoPerCapita" REAL,
	"PopulacaoAtendida" INTEGER,
	"HorizonteProjeto" INTEGER,
	"PrevisaoPerdas" REAL,
	"NumeroConcessao" INTEGER,
	"PopulacaoProjeto" INTEGER,
	"TipoPrestadora" tipo_provedor_enum
);

COPY "Saneamento"("Usos_Id", --FK
	"Entidade", --H0100
	"Distrito", --H0101
	"Municipio_Id", --H0102
	"VazaoPerCapita", --H0104
	"PopulacaoAtendida",--H0105
	"HorizonteProjeto", --H0106
	"PrevisaoPerdas", --H0107
	"NumeroConcessao", --H0108
	"PopulacaoProjeto", --H0109
	"TipoPrestadora") --H0110
FROM '/var/lib/postgres/data/Saneamento.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "CulturasIrrigadas" (
	"Id" SERIAL PRIMARY KEY,
	"Irrigacao_Id" INTEGER NOT NULL REFERENCES "Irrigacao"("Id"),
	"Cultura" VARCHAR(50),
	"AreaIrrigada" REAL,
	"PorDia" REAL,
	"PeriodoCultivo" REAL,
	"TipoIrrigacao" VARCHAR(50)
);

COPY "CulturasIrrigadas" ("Irrigacao_Id", --FK
	"Cultura", --H030x
	"AreaIrrigada", --H030x
	"PorDia", --H030x
	"PeriodoCultivo", --H030x
	"TipoIrrigacao" --H030x
)
FROM '/var/lib/postgres/data/CulturasIrrigadas.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE tipo_estrutura_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Barramento ou açude em curso dágua',
    'Barramento para tanque rede/gaiola'
);

CREATE TYPE localizacao_estrutura_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'No leito do curso de água',
    'Fora do leito do curso de água'
);

CREATE TYPE atividade_enum AS ENUM(
    'Não informado',
    'Não aplicável',
    'Cria',
    'Recria',
    'Engorda',
    'Reprodução',
    'Recria/Engorda'
);

CREATE TABLE "Aquiculturas" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"NumTanques" SMALLINT,
	"LaminaAgua" REAL,
	"TipoCriacao" VARCHAR(100),
	"TipoEstrutura" tipo_estrutura_enum,
	"EspelhoAgua" REAL,
	"ProfundidadeMedia" REAL,
	"LocalEstrutura" localizacao_estrutura_enum,
	"Especies" VARCHAR(200),
	"Atividade" atividade_enum,
	"Prod1" REAL,
	"Prod2" REAL
);

COPY "Aquiculturas" ("Usos_Id", --FK
	"NumTanques", --H0400
	"LaminaAgua", --H0401
	"TipoCriacao", --H0402
	"TipoEstrutura", --ENUM
	"EspelhoAgua", --H0404
	"ProfundidadeMedia", --H0405
	"LocalEstrutura", --ENUM
	"Especies", --H0407
	"Atividade", --ENUM
	"Prod1", --H0409
	"Prod2") --H0410
FROM '/var/lib/postgres/data/Aquiculturas.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "Industria" (
	"Id" SERIAL PRIMARY KEY,
	"Uso_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"ProdutosElaborados" VARCHAR(100),
	"TipoCNAE" VARCHAR(20),
	"ConsumoIndustrial" REAL,
	"PrevisaoPerdas" REAL
);

COPY "Industria"("Uso_Id", --FK
	"ProdutosElaborados", --H0200
	"TipoCNAE", --H0201
	"ConsumoIndustrial", --H0202
	"PrevisaoPerdas") --H0203
FROM '/var/lib/postgres/data/Industria.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE tipo_estabelecimento_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Alojamento',
    'Hotel',
    'Escola com lanchonete, sem ginásio, chuveiro',
    'Escola sem lanchonete, ginásio, chuveiro',
    'Escola com lanchonete, ginásio, chuveiro',
    'Restaurante',
    'Clínica de repouso',
    'Banheiro público',
    'Motel',
    'Cinema/teatro',
    'Loja',
    'Escritório',
    'Mercado',
    'Lanchonete',
    'Bar',
    'Indústria (esgoto sanitário)',
    'Loja de departamento',
    'Posto de gasolina',
    'Shopping center'
);

CREATE TABLE "ConsumoHumano" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"TipoEstabelecimento" tipo_estabelecimento_enum,
	"NumPessoas" INTEGER,
	"QntdDia" REAL
);

COPY "ConsumoHumano"("Usos_Id", --FK
	"TipoEstabelecimento", --H0000
	"NumPessoas", --H0001
	"QntdDia" --H0002
)
FROM '/var/lib/postgres/data/ConsumoHumano.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE processo_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Desmonte hidráulico',
    'Escavações em meio encosta',
    'Lavra subterrânea',
    'Lavra a céu aberto (com ou sem explosivos)',
    'Extração em leito de rio, lago ou reservatório'
);

CREATE TABLE "Mineracao" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"ProducaoMensal" REAL,
	"TeorUmidade" REAL,
	"PropAguaPolpa" REAL,
	"CNAE" VARCHAR(20),
	"Produto" VARCHAR(100),
	"ProdMax" REAL,
	"Processo" processo_enum
);

COPY "Mineracao"("Usos_Id", --FK
	"ProducaoMensal", --H0700
	"TeorUmidade", --H0701
	"PropAguaPolpa", --H0702
	"CNAE", --H0703
	"Produto", --H0704
	"ProdMax", --H0705
	"Processo" --H0706
)
FROM '/var/lib/postgres/data/Mineracao.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "DestinosEspeciais" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"Uso" VARCHAR(200)
);

COPY "DestinosEspeciais" (
	"Usos_Id", --FK
	"Uso" --H1300
)
FROM '/var/lib/postgres/data/DestinosEspeciais.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "ControleAmbiental" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"Tipo" VARCHAR(200),
	"Outros" VARCHAR(200)
);

COPY "ControleAmbiental" (
	"Usos_Id", --FK
	"Tipo", --H1100
	"Outros" --H1101
)
FROM '/var/lib/postgres/data/ControleAmbiental.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE caracteristicas_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Dragagem em corpo de água para fins de extração mineral',
    'Controle de sedimentos',
    'Controle de salinização'
);

CREATE TABLE "DiluicaoEfluentes" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"Origem" VARCHAR(200),
	"PopAtendida" INTEGER,
	"ContribuicaoPerCapita" REAL,
	"ProdElaborados" VARCHAR(200),
	"ProdDiaria" REAL,
	"Vazao" REAL,
	"HorasCapLancDia" REAL,
	"Caracteristicas" caracteristicas_enum,
	"Outros" VARCHAR(200)
);

COPY "DiluicaoEfluentes" (
	"Usos_Id", --FK
	"Origem", --H0900
	"PopAtendida", --H0901
	"ContribuicaoPerCapita", --H0902
	"ProdElaborados", --H0903
	"ProdDiaria", --H0904
	"Vazao", --H0905
	"HorasCapLancDia", --H0906
	"Caracteristicas", --H0907
	"Outros" --H0908
)
FROM '/var/lib/postgres/data/DiluicaoEfluentes.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "Militar" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"Uso" VARCHAR(200)
);

COPY "Militar" (
	"Usos_Id", --FK
	"Uso" --H1200
)
FROM '/var/lib/postgres/data/Militar.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "RHManejados" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"Tipo" VARCHAR(200),
	"Outros" VARCHAR(200)
);

COPY "RHManejados" (
	"Usos_Id", --FK
	"Tipo", --H1000
	"Outros" --H1001
)
FROM '/var/lib/postgres/data/RHManejados.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE combustivel_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Gás natural',
    'Óleos vegetais',
    'Óleo pesado',
    'Carvão vegetal',
    'Gases de siderurgia',
    'Xisto betuminoso',
    'Óleo diesel',
    'Biomassa'
);

CREATE TABLE "Termelétrica" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"PotenciaInstalada" INTEGER,
	"ProducaoMensal" REAL,
	"EnergiaMedia" REAL,
	"CombustivelPrincipal" combustivel_enum
);

COPY "Termelétrica" (
	"Usos_Id", --FK
	"PotenciaInstalada", --H0800
	"ProducaoMensal", --H0801
	"EnergiaMedia", --H0802
	"CombustivelPrincipal" --H0803
)
FROM '/var/lib/postgres/data/Termelétrica.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "LavagemVeiculos" (
	"Id" SERIAL PRIMARY KEY,
	"Usos_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"TratamentoEfluente" BOOLEAN,
	"Recirculacao" BOOLEAN,
	"Reuso" BOOLEAN,
	"Vazao" REAL,
	"VeiculosDia" INTEGER,
	"VolumeDiario" REAL
);

COPY "LavagemVeiculos" (
	"Usos_Id", --FK
	"TratamentoEfluente", --H0600
	"Recirculacao", --H0601
	"Reuso", --H0602
	"Vazao", --H0603
	"VeiculosDia", --H0604
	"VolumeDiario" --H0605
)
FROM '/var/lib/postgres/data/LavagemVeiculos.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE tipo_operacao_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Ativo (bombeando)',
    'Desativado com equipamento',
    'Não utilizável',
    'Fechado',
    'Abandonado',
    'Colmatado',
    'Tamponado sem relatório',
    'Tamponado com relatório'
);

CREATE TYPE tipo_instalacao_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Submersa',
    'Ar comprimido',
    'Injetora',
    'Centrífuga'
);

CREATE TABLE "Bombas" (
	"Id" SERIAL PRIMARY KEY,
	"Poco_Id" INTEGER NOT NULL REFERENCES "Pocos"("Id"),
	"TipoOperacao" tipo_operacao_enum,
	"TipoInstalacao" tipo_instalacao_enum,
	"CotaSuccao" REAL,
	"Crivo" REAL,
	"Capacidade" REAL,
	"Base" REAL,
	"Topo" REAL,
	"DistanciaFossa" REAL,
	"Aquifero" VARCHAR(100),
	"DataTeste" DATE,
	"TempoTeste" REAL
);

COPY "Bombas" (
	"Poco_Id", --FK
	"TipoOperacao", --G0200
	"TipoInstalacao", --G0202
	"CotaSuccao", --G0204
	"Crivo", --G0206
	"Capacidade", --G0208
	"Base", --G0306
	"Topo", --G0307
	"DistanciaFossa", --G0209
	"Aquifero", --G0308
	"DataTeste", --G0318
	"TempoTeste" --G0319
)
FROM '/var/lib/postgres/data/Bombas.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "TesteVazao" (
	"Id" SERIAL PRIMARY KEY,
	"Bomba_Id" INTEGER NOT NULL REFERENCES "Bombas"("Id"),
	"NivelEstatico" REAL,
	"NivelDinamico" REAL,
	"ColunaEstatica" REAL,
	"ColunaDinamica" REAL,
	"Rebaixamento" REAL,
	"VazaoEstabilizacao" REAL
);

COPY "TesteVazao" (
	"Bomba_Id", --FK
	"NivelEstatico", --G0300
	"NivelDinamico", --G0301
	"ColunaEstatica", --G0302
	"ColunaDinamica", --G0303
	"Rebaixamento", --G0304
	"VazaoEstabilizacao" --G0305
)
FROM '/var/lib/postgres/data/TesteVazao.csv' DELIMITER ';' CSV HEADER;

CREATE TYPE penetracao_aquifero_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Parcial',
    'Total'
);

CREATE TYPE condicoes_aquifero_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Livre',
    'Semi-livre',
    'Confinado',
    'Semi-confinado'
);

CREATE TYPE tipo_teste_enum AS ENUM(
	'Não informado',
    'Não aplicável',
    'Contínuo',
    'Escalonado',
    'Recarga',
    'Rebaixamento'
);

CREATE TABLE "TesteBombeamento" (
	"Id" SERIAL PRIMARY KEY,
	"Bomba_Id" INTEGER NOT NULL REFERENCES "Usos"("Id"),
	"VazaoBombeamento" REAL, 
	"CoeficienteArmazenamento" REAL,
	"VazaoEspecifica" REAL,
	"Permeabilidade" REAL,
	"Transmissibilidade" REAL,
	"CondutividadeHidraulica" REAL,
	"TipoTeste" tipo_teste_enum,
	"PenetracaoAquifero" penetracao_aquifero_enum,
	"CondicoesAquifero" condicoes_aquifero_enum
);

COPY "TesteBombeamento" (
	"Bomba_Id", --FK
	"VazaoBombeamento", --G0312
	"CoeficienteArmazenamento", --G0313
	"VazaoEspecifica", --G0314
	"Permeabilidade", --G0315
	"Transmissibilidade", --G0316
	"CondutividadeHidraulica", --G0317
	"TipoTeste", --G0320
	"PenetracaoAquifero", --G0311
	"CondicoesAquifero" --G0310
)
FROM '/var/lib/postgres/data/TesteBombeamento.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE "Hidroquimica" (
	"Id" SERIAL PRIMARY KEY,
	"Poco_Id" INTEGER NOT NULL REFERENCES "Pocos"("Id"),
	"DataColeta" DATE,
	"DataAnalise" DATE,
	"Bicarbonatos" REAL,
	"Calcio" REAL,
	"Carbonatos" REAL,
	"Cloretos" REAL,
	"Condutividade" REAL,
	"DurezaTotal" REAL,
	"FerroTotal" REAL,
	"Fluoretos" REAL,
	"Fosfatos" REAL,
	"Magnesio" REAL,
	"Nitratos" REAL,
	"Nitritos" REAL,
	"Ph" REAL,
	"Potassio" REAL,
	"Sodio" REAL,
	"SolidosDissolvidos" REAL,
	"Sulfatos" REAL,
	"Turbidez" REAL,
	"Temperatura" REAL,
	"ColiformesFecais" REAL,
	"ColiformesTotais" REAL
);

COPY "Hidroquimica" (
	"Poco_Id", --FK
	"DataColeta", --G0344
	"DataAnalise", --G0345
	"Bicarbonatos", --G0323
	"Calcio", --G0324
	"Carbonatos", --G0325
	"Cloretos", --G0326
	"Condutividade", --G0327
	"DurezaTotal", --G0328
	"FerroTotal", --G0329
	"Fluoretos", --G0330
	"Fosfatos", --G0331
	"Magnesio", --G0332
	"Nitratos", --G0333
	"Nitritos", --G0334
	"Ph", --G0335
	"Potassio", --G0336
	"Sodio", --G0337
	"SolidosDissolvidos", --G0338
	"Sulfatos", --G0339
	"Turbidez", --G0340
	"Temperatura", --G0341
	"ColiformesFecais", --G0342
	"ColiformesTotais" --G0343
)
FROM '/var/lib/postgres/data/Hidroquimica.csv' DELIMITER ';' CSV HEADER;
