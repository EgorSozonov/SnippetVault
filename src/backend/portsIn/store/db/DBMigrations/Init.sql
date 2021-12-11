--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5

-- Started on 2021-10-23 17:29:32

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
-- TOC entry 8 (class 2615 OID 16395)
-- Name: blog; Type: SCHEMA; Schema: -; Owner: zrx
--



SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 198 (class 1259 OID 16396)
-- Name: User; Type: TABLE; Schema: blog; Owner: zrx
--

CREATE TABLE blog."User" (
    "Id" integer NOT NULL,
    "UserName" character varying(32) DEFAULT 'username'::character varying NOT NULL,
    "Sal" character varying(8) DEFAULT 'asdfqwer'::character varying NOT NULL,
    "Registered" date DEFAULT '1900-01-01'::date NOT NULL,
    "Picadillo" bit varying(60) DEFAULT '0'::bit varying NOT NULL,
    "Email" character varying(128)
);


ALTER TABLE blog."User" OWNER TO blog_user;

--
-- TOC entry 199 (class 1259 OID 16399)
-- Name: Authentication_AuthenticationId_seq; Type: SEQUENCE; Schema: blog; Owner: zrx
--

ALTER TABLE blog."User" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME blog."Authentication_AuthenticationId_seq"
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 200 (class 1259 OID 16409)
-- Name: Comment; Type: TABLE; Schema: blog; Owner: zrx
--

CREATE TABLE blog."Comment" (
    "Id" integer NOT NULL,
    "UserId" integer NOT NULL,
    "Content" text NOT NULL,
    "Dt" timestamp without time zone NOT NULL,
    "Level" integer NOT NULL,
    "ParentId" integer NOT NULL,
    "LayerParentId" integer NOT NULL,
    "PageId" integer NOT NULL
);


ALTER TABLE blog."Comment" OWNER TO blog_user;

--
-- TOC entry 204 (class 1259 OID 16443)
-- Name: Comment_Id_seq; Type: SEQUENCE; Schema: blog; Owner: zrx
--

ALTER TABLE blog."Comment" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME blog."Comment_Id_seq"
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 202 (class 1259 OID 16433)
-- Name: Log; Type: TABLE; Schema: blog; Owner: zrx
--

CREATE TABLE blog."Log" (
    "LogId" integer NOT NULL,
    "Dt" timestamp without time zone NOT NULL,
    "Msg" character varying(1024) NOT NULL
);


ALTER TABLE blog."Log" OWNER TO blog_user;

--
-- TOC entry 201 (class 1259 OID 16417)
-- Name: Page; Type: TABLE; Schema: blog; Owner: zrx
--

CREATE TABLE blog."Page" (
    "Id" integer NOT NULL,
    "Path" text NOT NULL,
    "Created" timestamp(6) with time zone NOT NULL,
    "Deleted" timestamp(6) with time zone,
    "Visits" integer NOT NULL
);


ALTER TABLE blog."Page" OWNER TO blog_user;

--
-- TOC entry 203 (class 1259 OID 16441)
-- Name: Page_PageId_seq; Type: SEQUENCE; Schema: blog; Owner: zrx
--

ALTER TABLE blog."Page" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME blog."Page_PageId_seq"
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 16571)
-- Name: comment; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv.comment (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "snippetId" integer NOT NULL,
    content text NOT NULL,
    "tsUpload" timestamp with time zone NOT NULL
);


ALTER TABLE sv.comment OWNER TO sv_user;

--
-- TOC entry 206 (class 1259 OID 16449)
-- Name: language; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv.language (
    id integer NOT NULL,
    code character varying(4) NOT NULL,
    name character varying(64) NOT NULL,
    "isDeleted" bit(1) DEFAULT (0)::bit(1) NOT NULL,
    "languageGroupId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE sv.language OWNER TO sv_user;

--
-- TOC entry 214 (class 1259 OID 16549)
-- Name: languageGroup; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv."languageGroup" (
    id integer NOT NULL,
    code character varying(16) NOT NULL,
    name character varying(64) NOT NULL,
    "sortingOrder" integer NOT NULL DEFAULT 1
);


ALTER TABLE sv."languageGroup" OWNER TO sv_user;

--
-- TOC entry 220 (class 1259 OID 16641)
-- Name: languageGroup_id_seq; Type: SEQUENCE; Schema: snippet; Owner: postgres
--

ALTER TABLE sv."languageGroup" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv."languageGroup_id_seq"
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 205 (class 1259 OID 16447)
-- Name: language_id_seq; Type: SEQUENCE; Schema: snippet; Owner: postgres
--

ALTER TABLE sv.language ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.language_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 16487)
-- Name: snippet; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv.snippet (
    id integer NOT NULL,
    "taskLanguageId" integer NOT NULL,
    content text NOT NULL,
    "isApproved" bit(1) DEFAULT (0)::bit(1) NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    "tsUpload" timestamp with time zone NOT NULL DEFAULT '2021-09-01 00:00:00+03'::timestamp with time zone,
    "authorId" integer NOT NULL,
    CONSTRAINT "author_user_FK" FOREIGN KEY ("authorId")
        REFERENCES sv."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
);


ALTER TABLE sv.snippet OWNER TO sv_user;

--
-- TOC entry 211 (class 1259 OID 16485)
-- Name: snippet_id_seq; Type: SEQUENCE; Schema: snippet; Owner: postgres
--

ALTER TABLE sv.snippet ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.snippet_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


TABLESPACE pg_default;

ALTER TABLE sv.snippet
    OWNER to sv_user;

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE sv.snippet TO sv_role;

GRANT ALL ON TABLE sv.snippet TO sv_user;



--
-- TOC entry 208 (class 1259 OID 16458)
-- Name: task; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv.task (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    "taskGroupId" integer NOT NULL,
    description character varying(256) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying
);


ALTER TABLE sv.task OWNER TO sv_user;

--
-- TOC entry 210 (class 1259 OID 16465)
-- Name: taskGroup; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv."taskGroup" (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    "isDeleted" bit(1) DEFAULT (0)::bit(1) NOT NULL
);


ALTER TABLE sv."taskGroup" OWNER TO sv_user;

--
-- TOC entry 209 (class 1259 OID 16463)
-- Name: taskGroup_id_seq; Type: SEQUENCE; Schema: snippet; Owner: postgres
--

ALTER TABLE sv."taskGroup" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv."taskGroup_id_seq"
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 213 (class 1259 OID 16544)
-- Name: taskLanguage; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv."taskLanguage" (
    id integer NOT NULL,
    "taskId" integer NOT NULL,
    "languageId" integer NOT NULL,
    "primarySnippetId" integer
);


ALTER TABLE sv."taskLanguage" OWNER TO sv_user;

--
-- TOC entry 218 (class 1259 OID 16637)
-- Name: taskLanguage_id_seq; Type: SEQUENCE; Schema: snippet; Owner: postgres
--

ALTER TABLE sv."taskLanguage" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv."taskLanguage_id_seq"
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 207 (class 1259 OID 16456)
-- Name: task_id_seq; Type: SEQUENCE; Schema: snippet; Owner: postgres
--

ALTER TABLE sv.task ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.task_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 16566)
-- Name: user; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv."user" (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    "dateJoined" timestamp with time zone NOT NULL,
    email character varying(64) COLLATE pg_catalog."default",
    expiration date NOT NULL DEFAULT '2021-09-01'::date,
    "accessToken" character varying(32) COLLATE pg_catalog."default" NOT NULL DEFAULT 'a'::character varying,
    hash bytea NOT NULL,
    salt bytea NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT "user_name_UNIQ" UNIQUE (name)
);


ALTER TABLE sv."user" OWNER TO sv_user;

--
-- TOC entry 217 (class 1259 OID 16579)
-- Name: userVote; Type: TABLE; Schema: snippet; Owner: postgres
--

CREATE TABLE sv."userVote" (
    "userId" integer NOT NULL,
    "taskLanguageId" integer NOT NULL,
    "snippetId" integer NOT NULL
);


ALTER TABLE sv."userVote" OWNER TO sv_user;

--
-- TOC entry 219 (class 1259 OID 16639)
-- Name: user_id_seq; Type: SEQUENCE; Schema: snippet; Owner: postgres
--

ALTER TABLE sv."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME sv.user_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1
);





--
-- TOC entry 2770 (class 2606 OID 16416)
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: blog; Owner: zrx
--

ALTER TABLE ONLY blog."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2775 (class 2606 OID 16440)
-- Name: Log Log_pkey; Type: CONSTRAINT; Schema: blog; Owner: zrx
--

ALTER TABLE ONLY blog."Log"
    ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("LogId");


--
-- TOC entry 2773 (class 2606 OID 16424)
-- Name: Page Page_pkey; Type: CONSTRAINT; Schema: blog; Owner: zrx
--

ALTER TABLE ONLY blog."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2768 (class 2606 OID 16426)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: blog; Owner: zrx
--

ALTER TABLE ONLY blog."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 2797 (class 2606 OID 16578)
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- TOC entry 2791 (class 2606 OID 16553)
-- Name: languageGroup languageGroup_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."languageGroup"
    ADD CONSTRAINT "languageGroup_pkey" PRIMARY KEY (id);


--
-- TOC entry 2777 (class 2606 OID 16455)
-- Name: language language_code_key; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.language
    ADD CONSTRAINT language_code_key UNIQUE (code);


--
-- TOC entry 2779 (class 2606 OID 16453)
-- Name: language language_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.language
    ADD CONSTRAINT language_pkey PRIMARY KEY (id);


--
-- TOC entry 2785 (class 2606 OID 16495)
-- Name: snippet snippet_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.snippet
    ADD CONSTRAINT snippet_pkey PRIMARY KEY (id);


--
-- TOC entry 2783 (class 2606 OID 16469)
-- Name: taskGroup taskGroup_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."taskGroup"
    ADD CONSTRAINT "taskGroup_pkey" PRIMARY KEY (id);


--
-- TOC entry 2787 (class 2606 OID 16595)
-- Name: taskLanguage taskLanguage_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_pkey" PRIMARY KEY (id);


--
-- TOC entry 2789 (class 2606 OID 16597)
-- Name: taskLanguage taskLanguage_task_language_UNIQ; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_task_language_UNIQ" UNIQUE ("taskId", "languageId");


--
-- TOC entry 2781 (class 2606 OID 16462)
-- Name: task task_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- TOC entry 2799 (class 2606 OID 16583)
-- Name: userVote userVote_PK; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_PK" PRIMARY KEY ("userId", "taskLanguageId");


--
-- TOC entry 2793 (class 2606 OID 16621)
-- Name: user user_name_UNIQ; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."user"
    ADD CONSTRAINT "user_name_UNIQ" UNIQUE (name);


--
-- TOC entry 2795 (class 2606 OID 16570)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 2771 (class 1259 OID 16432)
-- Name: fki_Comment_UserId_FK; Type: INDEX; Schema: blog; Owner: zrx
--

CREATE INDEX "fki_Comment_UserId_FK" ON blog."Comment" USING btree ("UserId");


--
-- TOC entry 2800 (class 2606 OID 16427)
-- Name: Comment Comment_UserId_FK; Type: FK CONSTRAINT; Schema: blog; Owner: zrx
--

ALTER TABLE ONLY blog."Comment"
    ADD CONSTRAINT "Comment_UserId_FK" FOREIGN KEY ("UserId") REFERENCES blog."User"("Id");


--
-- TOC entry 2801 (class 2606 OID 16555)
-- Name: language Language_LanguageGroup_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.language
    ADD CONSTRAINT "Language_LanguageGroup_FK" FOREIGN KEY ("languageGroupId") REFERENCES sv."languageGroup"(id);


--
-- TOC entry 2808 (class 2606 OID 16589)
-- Name: comment comment_snippet_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.comment
    ADD CONSTRAINT "comment_snippet_FK" FOREIGN KEY ("snippetId") REFERENCES sv.snippet(id);


--
-- TOC entry 2807 (class 2606 OID 16584)
-- Name: comment comment_user_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.comment
    ADD CONSTRAINT "comment_user_FK" FOREIGN KEY ("userId") REFERENCES sv."user"(id);


--
-- TOC entry 2803 (class 2606 OID 16598)
-- Name: snippet snippet_taskLanguage_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.snippet
    ADD CONSTRAINT "snippet_taskLanguage_FK" FOREIGN KEY ("taskLanguageId") REFERENCES sv."taskLanguage"(id);


--
-- TOC entry 2805 (class 2606 OID 16610)
-- Name: taskLanguage taskLanguage_language_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_language_FK" FOREIGN KEY ("languageId") REFERENCES sv.language(id);


--
-- TOC entry 2806 (class 2606 OID 16615)
-- Name: taskLanguage taskLanguage_snippet_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_snippet_FK" FOREIGN KEY ("primarySnippetId") REFERENCES sv.snippet(id);


--
-- TOC entry 2804 (class 2606 OID 16605)
-- Name: taskLanguage taskLanguage_task_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."taskLanguage"
    ADD CONSTRAINT "taskLanguage_task_FK" FOREIGN KEY ("taskId") REFERENCES sv.task(id);


--
-- TOC entry 2802 (class 2606 OID 16470)
-- Name: task task_taskGroupId_fkey; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv.task
    ADD CONSTRAINT "task_taskGroupId_fkey" FOREIGN KEY ("taskGroupId") REFERENCES sv."taskGroup"(id);


--
-- TOC entry 2811 (class 2606 OID 16632)
-- Name: userVote userVote_snippet_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_snippet_FK" FOREIGN KEY ("snippetId") REFERENCES sv.snippet(id);


--
-- TOC entry 2810 (class 2606 OID 16627)
-- Name: userVote userVote_taskLanguage_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_taskLanguage_FK" FOREIGN KEY ("taskLanguageId") REFERENCES sv."taskLanguage"(id);


--
-- TOC entry 2809 (class 2606 OID 16622)
-- Name: userVote userVote_user_FK; Type: FK CONSTRAINT; Schema: snippet; Owner: postgres
--

ALTER TABLE ONLY sv."userVote"
    ADD CONSTRAINT "userVote_user_FK" FOREIGN KEY ("userId") REFERENCES sv."user"(id);


