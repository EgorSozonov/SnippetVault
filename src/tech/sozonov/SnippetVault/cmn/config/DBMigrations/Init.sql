--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sv; Type: SCHEMA; Schema: -; Owner: sv_user
--

CREATE SCHEMA sv;


ALTER SCHEMA sv OWNER TO sv_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comment; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv.comment (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "snippetId" integer NOT NULL,
    content text NOT NULL,
    "tsUpload" timestamp with time zone NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE sv.comment OWNER TO sv_user;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv.comment ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: language; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv.language (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    "sortingOrder" smallint DEFAULT 1 NOT NULL,
    code character varying(4) DEFAULT ''::character varying NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE sv.language OWNER TO sv_user;

--
-- Name: language_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv.language ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.language_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: log; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv.log (
    id integer NOT NULL,
    ts timestamp with time zone NOT NULL,
    type smallint DEFAULT 1 NOT NULL,
    code character varying(16) NOT NULL,
    msg text NOT NULL
);


ALTER TABLE sv.log OWNER TO sv_user;

--
-- Name: log_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv.log ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

INSERT INTO sv."snippetStatus"(
	id, code)
	VALUES (1, 'Proposed'), (2, 'Declined'), (3, 'Approved') ;

--
-- Name: snippet; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv.snippet (
    id integer NOT NULL,
    "taskLanguageId" integer NOT NULL,
    content text NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    "tsUpload" timestamp with time zone DEFAULT '2021-09-01 00:00:00+03'::timestamp with time zone NOT NULL,
    "authorId" integer DEFAULT 2 NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    libraries text
);


ALTER TABLE sv.snippet OWNER TO sv_user;

--
-- Name: snippetStatus; Type: TABLE; Schema: sv; Owner: postgres
--

CREATE TABLE sv."snippetStatus" (
    id integer NOT NULL,
    code character varying(32) NOT NULL
);


ALTER TABLE sv."snippetStatus" OWNER TO postgres;

--
-- Name: snippet_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv.snippet ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.snippet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: task; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv.task (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    "taskGroupId" integer NOT NULL,
    description character varying(256) DEFAULT ''::character varying NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE sv.task OWNER TO sv_user;

--
-- Name: taskGroup; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv."taskGroup" (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    code character varying(16) DEFAULT ''::character varying NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE sv."taskGroup" OWNER TO sv_user;

--
-- Name: taskGroup_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv."taskGroup" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv."taskGroup_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: taskLanguage; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv."taskLanguage" (
    id integer NOT NULL,
    "taskId" integer NOT NULL,
    "languageId" integer NOT NULL,
    "primarySnippetId" integer
);


ALTER TABLE sv."taskLanguage" OWNER TO sv_user;

--
-- Name: taskLanguage_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv."taskLanguage" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv."taskLanguage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: task_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv.task ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv."user" (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    "dateJoined" timestamp with time zone NOT NULL,
    expiration timestamp with time zone DEFAULT '2021-09-01'::date NOT NULL,
    "accessToken" text DEFAULT 'a'::character varying NOT NULL,
    verifier bytea DEFAULT '\x00'::bytea NOT NULL,
    salt bytea DEFAULT '\x00'::bytea NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    b bytea DEFAULT '\x00'::bytea NOT NULL
);
ALTER TABLE ONLY sv."user" ALTER COLUMN verifier SET STORAGE EXTERNAL;
ALTER TABLE ONLY sv."user" ALTER COLUMN salt SET STORAGE EXTERNAL;
ALTER TABLE ONLY sv."user" ALTER COLUMN b SET STORAGE EXTERNAL;


ALTER TABLE sv."user" OWNER TO sv_user;

--
-- Name: userVote; Type: TABLE; Schema: sv; Owner: sv_user
--

CREATE TABLE sv."userVote" (
    "userId" integer NOT NULL,
    "taskLanguageId" integer NOT NULL,
    "snippetId" integer NOT NULL
);


ALTER TABLE sv."userVote" OWNER TO sv_user;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: sv; Owner: sv_user
--

ALTER TABLE sv."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



--
-- Name: language Code_Unique; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.language
    ADD CONSTRAINT "Code_Unique" UNIQUE (code);


--
-- Name: userVote Unique_User_TL; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "Unique_User_TL" UNIQUE ("userId", "taskLanguageId");


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: language language_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.language
    ADD CONSTRAINT language_pkey PRIMARY KEY (id);


--
-- Name: log log_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.log
    ADD CONSTRAINT log_pkey PRIMARY KEY (id);


--
-- Name: snippetStatus snippetStatus_pkey; Type: CONSTRAINT; Schema: sv; Owner: postgres
--

ALTER TABLE ONLY sv."snippetStatus"
    ADD CONSTRAINT "snippetStatus_pkey" PRIMARY KEY (id);


--
-- Name: snippet snippet_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.snippet
    ADD CONSTRAINT snippet_pkey PRIMARY KEY (id);


--
-- Name: taskGroup taskGroup_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."taskGroup"
    ADD CONSTRAINT "taskGroup_pkey" PRIMARY KEY (id);


--
-- Name: taskLanguage taskLanguage_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_pkey" PRIMARY KEY (id);


--
-- Name: taskLanguage taskLanguage_task_language_UNIQ; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_task_language_UNIQ" UNIQUE ("taskId", "languageId");


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: userVote userVote_PK; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_PK" PRIMARY KEY ("userId", "taskLanguageId");


--
-- Name: user user_name_UNIQ; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."user"
    ADD CONSTRAINT "user_name_UNIQ" UNIQUE (name);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: snippet author_user_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.snippet
    ADD CONSTRAINT "author_user_FK" FOREIGN KEY ("authorId") REFERENCES sv."user"(id) NOT VALID;


--
-- Name: comment comment_snippet_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.comment
    ADD CONSTRAINT "comment_snippet_FK" FOREIGN KEY ("snippetId") REFERENCES sv.snippet(id);


--
-- Name: comment comment_user_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.comment
    ADD CONSTRAINT "comment_user_FK" FOREIGN KEY ("userId") REFERENCES sv."user"(id);


--
-- Name: snippet snippet_snippetStatus_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.snippet
    ADD CONSTRAINT "snippet_snippetStatus_FK" FOREIGN KEY (status) REFERENCES sv."snippetStatus"(id) NOT VALID;


--
-- Name: snippet snippet_taskLanguage_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.snippet
    ADD CONSTRAINT "snippet_taskLanguage_FK" FOREIGN KEY ("taskLanguageId") REFERENCES sv."taskLanguage"(id);


--
-- Name: taskLanguage taskLanguage_language_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_language_FK" FOREIGN KEY ("languageId") REFERENCES sv.language(id);


--
-- Name: taskLanguage taskLanguage_snippet_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_snippet_FK" FOREIGN KEY ("primarySnippetId") REFERENCES sv.snippet(id);


--
-- Name: taskLanguage taskLanguage_task_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_task_FK" FOREIGN KEY ("taskId") REFERENCES sv.task(id);


--
-- Name: task task_taskGroupId_fkey; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv.task
    ADD CONSTRAINT "task_taskGroupId_fkey" FOREIGN KEY ("taskGroupId") REFERENCES sv."taskGroup"(id);


--
-- Name: userVote userVote_snippet_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_snippet_FK" FOREIGN KEY ("snippetId") REFERENCES sv.snippet(id);


--
-- Name: userVote userVote_taskLanguage_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_taskLanguage_FK" FOREIGN KEY ("taskLanguageId") REFERENCES sv."taskLanguage"(id);


--
-- Name: userVote userVote_user_FK; Type: FK CONSTRAINT; Schema: sv; Owner: sv_user
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_user_FK" FOREIGN KEY ("userId") REFERENCES sv."user"(id);


--
-- Name: SCHEMA sv; Type: ACL; Schema: -; Owner: sv_user
--

GRANT USAGE ON SCHEMA sv TO sv_role;
GRANT ALL ON SCHEMA sv TO postgres;


--
-- Name: TABLE comment; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv.comment TO sv_role;


--
-- Name: TABLE language; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv.language TO sv_role;


--
-- Name: TABLE snippet; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv.snippet TO sv_role;


--
-- Name: TABLE "snippetStatus"; Type: ACL; Schema: sv; Owner: postgres
--

REVOKE ALL ON TABLE sv."snippetStatus" FROM postgres;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv."snippetStatus" TO sv_role;
GRANT ALL ON TABLE sv."snippetStatus" TO sv_user;


--
-- Name: TABLE task; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv.task TO sv_role;


--
-- Name: TABLE "taskGroup"; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv."taskGroup" TO sv_role;


--
-- Name: TABLE "taskLanguage"; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv."taskLanguage" TO sv_role;


--
-- Name: TABLE "user"; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv."user" TO sv_role;


--
-- Name: TABLE "userVote"; Type: ACL; Schema: sv; Owner: sv_user
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE sv."userVote" TO sv_role;


--
-- PostgreSQL database dump complete
--
