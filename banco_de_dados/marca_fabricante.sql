create database fabricante_marca;
use fabricante_marca;

create table Fabricante 
(idFabricante int unique not null auto_increment,
tipo_pessoa varchar(2) not null,
documento_fiscal varchar(14) not null unique,
nome_fabricante varchar(120) character set utf8mb4 collate utf8mb4_unicode_ci unique not null,
email_fabricante varchar(45) not null,
telefone_fabricante varchar(45) not null,
cep varchar(8) not null,
estado varchar(2) not null,
cidade varchar(30) not null,
bairro varchar(50) not null,
logradouro varchar(100) not null,
numero varchar(10) not null,
complemento varchar(10),
status_fabricante varchar(20) not null default 'Ativo',
primary key (idFabricante)
)
engine = InnoDB;

create table Marca
(idMarca int unique not null auto_increment,
fk_idFabricante int not null,
nome_marca varchar(45) character set utf8mb4 collate utf8mb4_unicode_ci not null unique,
logotipo_marca varchar(200) not null,
status_marca varchar(20) not null default 'Ativo',
primary key (idMarca),
foreign key (fk_idFabricante) references fabricante(idFabricante) 
)
engine = InnoDB;

create table Audit_Logs
(idAudit_Logs int not null auto_increment,
autor_id varchar(100) not null default 'Plataforma',
acao varchar(10) not null,
nome_tabela varchar(64) not null,
recordar_id varchar(50) not null, -- ID do registro afetado
alterado_em timestamp default current_timestamp,
primary key(idAudit_Logs)
)
engine = InnoDB;


DELIMITER //

-- Auditoria de 'Insert' de Fabricante
CREATE TRIGGER audit_fabricante_insert AFTER INSERT ON Fabricante
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Logs (acao, nome_tabela, recordar_id)
    VALUES ('INSERT', 'Fabricante', NEW.idFabricante);
END; //

-- Auditoria de 'Update' de Fabricante
CREATE TRIGGER audit_fabricante_update AFTER UPDATE ON Fabricante
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Logs (acao, nome_tabela, recordar_id)
    VALUES ('UPDATE', 'Fabricante', NEW.idFabricante);
END; //
DELIMITER ;


DELIMITER //

-- Auditoria de 'Insert' de Marca
CREATE TRIGGER audit_marca_insert AFTER INSERT ON Marca
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Logs (acao, nome_tabela, recordar_id)
    VALUES ('INSERT', 'Marca', NEW.idMarca);
END; //

-- Auditoria de 'Update' de Marca
CREATE TRIGGER audit_marca_update AFTER UPDATE ON Marca
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Logs (acao, nome_tabela, recordar_id)
    VALUES ('UPDATE', 'Marca', NEW.idMarca);
END; //

DELIMITER ;


DELIMITER //

CREATE TRIGGER check_desativar_fabricante
AFTER UPDATE ON Marca
FOR EACH ROW
BEGIN
    DECLARE total_marcas INT;

    -- Regra: Só executa se o novo status da marca não for 'Ativo'
    IF NEW.status_marca <> 'Ativo' THEN
        
        -- Conta quantas marcas este fabricante possui no total
        SELECT COUNT(*) INTO total_marcas 
        FROM Marca 
        WHERE fk_idFabricante = NEW.fk_idFabricante;

        -- Se o fabricante tiver apenas 1 marca (que acabou de ser desativada), 
        -- então desativa o fabricante também.
        IF total_marcas = 1 THEN
            UPDATE Fabricante 
            SET status_fabricante = 'Inativo' 
            WHERE idFabricante = NEW.fk_idFabricante;
        END IF;

    END IF;
END; //

DELIMITER ;

DELIMITER //

CREATE TRIGGER desativar_fabricante_desativa_marcas
AFTER UPDATE ON Fabricante
FOR EACH ROW
BEGIN
    -- Regra: Se o Fabricante mudou de 'Ativo' para 'Inativo'
    IF NEW.status_fabricante = 'Inativo' AND OLD.status_fabricante = 'Ativo' THEN
        
        -- Atualiza todas as marcas vinculadas (1:N)
        UPDATE Marca 
        SET status_marca = 'Inativo' 
        WHERE fk_idFabricante = NEW.idFabricante;
        
    END IF;
END; //

DELIMITER ;