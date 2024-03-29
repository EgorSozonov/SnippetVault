
---------------------------
-- Languages
---------------------------
INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (1, 'CS', 'C#', FALSE, 1)
ON CONFLICT (id) DO UPDATE SET code='CS', name='C#', "isDeleted" = FALSE, "sortingOrder" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (2, 'Rust', 'Rust', FALSE, 1)
ON CONFLICT (id) DO UPDATE SET code='Rust', name='Rust', "isDeleted" = FALSE, "sortingOrder" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (3, 'Cpp', 'C++', FALSE, 1)
ON CONFLICT (id) DO UPDATE SET code='Cpp', name='C++', "isDeleted" = FALSE, "sortingOrder" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (4, 'Pyth', 'Python', FALSE, 2)
ON CONFLICT (id) DO UPDATE SET code='Pyth', name='Python', "isDeleted" = FALSE, "sortingOrder" = 2;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (5, 'TS', 'Typescript', FALSE, 2)
ON CONFLICT (id) DO UPDATE SET code='TS', name='Typescript', "isDeleted" = FALSE, "sortingOrder" = 2;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (6, 'MSQL', 'MySQL', FALSE, 3)
ON CONFLICT (id) DO UPDATE SET code='MSQL', name='MySQL', "isDeleted" = FALSE, "sortingOrder" = 3;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (7, 'TSQL', 'T-SQL', FALSE, 3)
ON CONFLICT (id) DO UPDATE SET code='TSQL', name='T-SQL', "isDeleted" = FALSE, "sortingOrder" = 3;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (8, 'PSQL', 'PostgreSQL', FALSE, 3)
ON CONFLICT (id) DO UPDATE SET code='PSQL', name='PostgreSQL', "isDeleted" = FALSE, "sortingOrder" = 3;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (9, 'Kotl', 'Kotlin', FALSE, 1)
ON CONFLICT (id) DO UPDATE SET code='Kotl', name='Kotlin', "isDeleted" = FALSE, "sortingOrder" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (10, 'Lua', 'Lua', FALSE, 2)
ON CONFLICT (id) DO UPDATE SET code='Lua', name='Lua', "isDeleted" = FALSE, "sortingOrder" = 2;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (11, 'Swif', 'Swift', FALSE, 1)
ON CONFLICT (id) DO UPDATE SET code='Swif', name='Swift', "isDeleted" = FALSE, "sortingOrder" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (12, 'Java', 'Java', FALSE, 1)
ON CONFLICT (id) DO UPDATE SET code='Java', name='Java', "isDeleted" = FALSE, "sortingOrder" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "sortingOrder")
OVERRIDING SYSTEM VALUE	VALUES (13, 'Dart', 'Dart', FALSE, 1)
ON CONFLICT (id) DO UPDATE SET code='Dart', name='Dart', "isDeleted" = FALSE, "sortingOrder" = 1;

ALTER TABLE sv.language ALTER COLUMN id RESTART WITH 14;

---------------------------
-- Task groups
---------------------------

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (1, 'SYNTAX', 'Basic syntax', FALSE)
ON CONFLICT (id) DO UPDATE SET code='SYNTAX', name='Basic syntax', "isDeleted" = FALSE;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (2, 'MATH', 'Math & arithmetic', FALSE)
ON CONFLICT (id) DO UPDATE SET code='MATH', name='Math & arithmetic', "isDeleted" = FALSE;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (3, 'STRINGS', 'Strings', FALSE)
ON CONFLICT (id) DO UPDATE SET code='STRINGS', name='Strings', "isDeleted" = FALSE;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (4, 'IO', 'Basic input & output', FALSE)
ON CONFLICT (id) DO UPDATE SET code='IO', name='Basic input & output', "isDeleted" = FALSE;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (5, 'FILES', 'File system', FALSE)
ON CONFLICT (id) DO UPDATE SET code='FILES', name='File system', "isDeleted" = FALSE;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (6, 'SORTING', 'Sorting algorithms', FALSE)
ON CONFLICT (id) DO UPDATE SET code='SORTING', name='Sorting algorithms', "isDeleted" = FALSE;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (7, 'TREES', 'Tree algorithms', FALSE)
ON CONFLICT (id) DO UPDATE SET code='TREES', name='Tree algorithms', "isDeleted" = FALSE;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (8, 'GRAPH', 'Graph algorithms', FALSE)
ON CONFLICT (id) DO UPDATE SET code='GRAPH', name='Graph algorithms', "isDeleted" = FALSE;

ALTER TABLE sv."taskGroup" ALTER COLUMN id RESTART WITH 9;

---------------------------
-- Tasks
---------------------------

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (1, 'Immutable variable definition', 'Declare + define an immutable local variable', 1)
ON CONFLICT (id) DO UPDATE SET name='Immutable variable definition', description = 'Declare + define an immutable local variable', "taskGroupId" = 1;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (2, 'Mutable variable definition', 'Declare + define a mutable local variable', 1)
ON CONFLICT (id) DO UPDATE SET name='Mutable variable definition', description = 'Declare + define a mutable local variable', "taskGroupId" = 1;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (3, 'Mutable variable assignment', 'Re-assign a value to a mutable local variable', 1)
ON CONFLICT (id) DO UPDATE SET name = 'Mutable variable assignment', description = 'Re-assign a value to a mutable local variable', "taskGroupId" = 1;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (4, 'If-else expression', 'A conditional expression with an if, else-if, and else blocks', 1)
ON CONFLICT (id) DO UPDATE SET name = 'If-else expression', description = 'A conditional expression with an if, else-if, and else blocks', "taskGroupId" = 1;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (5, 'Square root', 'Calculation of a square root respectively for a floating-point number', 2)
ON CONFLICT (id) DO UPDATE
SET name = 'Square root', description = 'Calculation of a square root respectively for an integer and for a floating-point number', "taskGroupId" = 2;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (6, 'Power', 'Arithmetic power expression', 2)
ON CONFLICT (id) DO UPDATE SET name = 'Power', description = 'Arithmetic power expression', "taskGroupId" = 2;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (7, 'Substring', 'Substring of a string starting at index x and having length n', 3)
ON CONFLICT (id) DO UPDATE SET name='Substring', description = 'Substring of a string starting at index x and having length n', "taskGroupId" = 3;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (8, 'Index of substring', 'Find index of substring sub within string str', 3)
ON CONFLICT (id) DO UPDATE SET name='Index of substring', description = 'Find index of substring sub within string str', "taskGroupId" = 3;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (9, 'Index of substring from back', 'Find index of substring sub within string str, starting from the back', 3)
ON CONFLICT (id) DO UPDATE SET name = 'Index of substring from back', description = '', "taskGroupId" = 3;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (10, 'Reverse string', 'Reverse a string', 3)
ON CONFLICT (id) DO UPDATE SET name = 'Reverse string', description = 'Reverse a string', "taskGroupId" = 3;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (11, 'Print text to stdout', 'Print Hello, World text to stdout, with newline at the end', 4)
ON CONFLICT (id) DO UPDATE SET name = 'Print text to stdout', description = 'Print Hello, World text to stdout, with newline at the end', "taskGroupId" = 4;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (12, 'Read line', 'Read a line of text from stdin', 4)
ON CONFLICT (id) DO UPDATE SET name = 'Read line', description = 'Read a line of text from stdin', "taskGroupId" = 4;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (13, 'Read char', 'Read a single character from stdin', 4)
ON CONFLICT (id) DO UPDATE SET name='Read char', description = 'Read a single character from stdin', "taskGroupId" = 4;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (14, 'Read text file line by line', 'Read a text file line-by-line without loading the complete file into memory', 4)
ON CONFLICT (id) DO UPDATE
SET name = 'Read text file line by line', description = 'Read a text file line-by-line without loading the complete file into memory', "taskGroupId" = 4;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (15, 'Write text to a file line by line', 'Write text to a newly created/overwritten file line-by-line', 4)
ON CONFLICT (id) DO UPDATE SET name = 'Write text to a file line by line', description = 'Write text to a newly created/overwritten file line-by-line', "taskGroupId" = 4;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (16, 'Walk the files in a folder', 'Walk all the files in a folder, getting their names, sizes & dates of modifications', 5)
ON CONFLICT (id) DO UPDATE SET name='Walk the files in a folder', description = 'Walk all the files in a folder, getting their names, sizes & dates of modifications', "taskGroupId" = 5;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (17, 'Walk all the subfolders', 'Walk all the subfolders of a folder', 5)
ON CONFLICT (id) DO UPDATE SET name = 'Walk all the subfolders', description = 'Walk all the subfolders of a folder', "taskGroupId" = 5;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (18, 'Bubble sort', 'Bubble sort a generic array of comparable T ascending', 6)
ON CONFLICT (id) DO UPDATE SET name = 'Bubble sort', description = '', "taskGroupId" = 6;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (19, 'Insertion sort', 'Insertion-sort a generic array of comparable T ascending', 6)
ON CONFLICT (id) DO UPDATE SET name = 'Insertion sort', description = 'Insertion-sort a generic array of comparable T ascending', "taskGroupId" = 6;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (20, 'Quicksort', 'Quick-sort a generic array of comparable T ascending', 6)
ON CONFLICT (id) DO UPDATE SET name='Quicksort', description = 'Quick-sort a generic array of comparable T ascending', "taskGroupId" = 6;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (21, 'Timsort', 'Timsort a generic array of comparable T ascending', 6)
ON CONFLICT (id) DO UPDATE SET name='Quicksort', description = 'Timsort a generic array of comparable T ascending', "taskGroupId" = 6;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (22, 'Shellsort', 'Shellsort a generic array of comparable T ascending', 6)
ON CONFLICT (id) DO UPDATE SET name='Shellsort', description = 'Shellsort a generic array of comparable T ascending', "taskGroupId" = 6;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (23, 'AVL tree', 'Construct an ascending AVL tree from a generic array of comparable T', 7)
ON CONFLICT (id) DO UPDATE SET name='AVL tree', description = 'Construct an ascending AVL tree from a generic array of comparable T', "taskGroupId" = 7;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (24, 'Red-black tree', 'Construct an ascending Red-black tree from a generic array of comparable T', 7)
ON CONFLICT (id) DO UPDATE SET name='Red-black tree', description = 'Construct an ascending Red-black tree from a generic array of comparable T', "taskGroupId" = 7;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (25, 'Depth-first search', 'Perform a depth-first search for an equatable generic T in a graph represented as arrays of nodes and edges', 8)
ON CONFLICT (id) DO UPDATE SET name='Depth-first search', description = 'Perform a depth-first search for an equatable generic T in a graph represented as arrays of nodes and edges', "taskGroupId" = 8;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (26, 'Breadth-first search', 'Perform a breadth-first search for an equatable generic T in a graph represented as arrays of nodes and edges', 8)
ON CONFLICT (id) DO UPDATE SET name = 'Breadth-first search', description = 'Perform a breadth-first search for an equatable generic T in a graph represented as arrays of nodes and edges', "taskGroupId" = 8;

ALTER TABLE sv.task ALTER COLUMN id RESTART WITH 27;

---------------------------
-- Task Languages
---------------------------

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (1, 1, 1, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 1, "languageId" = 1, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (2, 2, 1, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 2, "languageId" = 1, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (3, 3, 1, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 3, "languageId" = 1, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (4, 4, 1, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 4, "languageId" = 1, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (5, 5, 1, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 5, "languageId" = 1, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (6, 6, 1, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 6, "languageId" = 1, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (7, 1, 2, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 1, "languageId" = 2, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (8, 2, 2, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 2, "languageId" = 2, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (9, 3, 2, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 3, "languageId" = 2, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (10, 4, 2, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 4, "languageId" = 2, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (11, 5, 2, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 5, "languageId" = 2, "primarySnippetId" = NULL;

INSERT INTO sv."taskLanguage"(id, "taskId", "languageId", "primarySnippetId")
OVERRIDING SYSTEM VALUE	VALUES (12, 6, 2, NULL)
ON CONFLICT (id) DO UPDATE SET "taskId" = 6, "languageId" = 2, "primarySnippetId" = NULL;

ALTER TABLE sv."taskLanguage" ALTER COLUMN id RESTART WITH 13;

---------------------------
-- Snippets
---------------------------

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (1, 1, 'ref readonly int x = ref value;', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 1, content = 'ref readonly int x = ref value;', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (2, 2, 'var x = 0;', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 2, content = 'var x = 0;', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (3, 3, 'x = 5;', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 3, content = 'x = 5;', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (4, 4, 'if (x > 5) {
    // if branch
} else if (x > 3) {
    // else-if branch
} else {
    // else branch
}', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 4, content = 'if (x > 5) {
    // if branch
} else if (x > 3) {
    // else-if branch
} else {
    // else branch
}', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (5, 5, 'var four = Math.sqrt(16.0);', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 5, content = 'var x = Math.sqrt(5.0);', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (6, 6, 'var sixteen = Math.Pow(2, 4);', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 6, content = 'var sixteen = Math.Pow(2, 4);', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (7, 7, 'let x = value;', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 1, content = '', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (8, 8, 'let mut x = 5;', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 2, content = '', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (9, 9, 'x = 0;', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 3, content = '', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (10, 10, 'if x > 5 {
    // if branch
} else if x > 3 {
    // else if branch
} else {
    // else branch
}', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 4, content = 'if x > 5 {
    // if branch
} else if x > 3 {
    // else if branch
} else {
    // else branch
}', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (11, 11, 'let four = f64::sqrt(16.0);', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 5, content = 'let four = f64::sqrt(16.0);', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

INSERT INTO sv.snippet(
	id, "taskLanguageId", content, score, "tsUpload", "authorId", status)
OVERRIDING SYSTEM VALUE	VALUES (12, 12, 'let sixteen = f64::checked_pow(2, 4);', 1, '20220120', 1, 3)
ON CONFLICT (id) DO UPDATE SET "taskLanguageId" = 6, content = 'let sixteen = f64::checked_pow(2, 4);', score = 1, "tsUpload" = '20220120', "authorId" = 1, status = 3;

ALTER TABLE sv."snippet" ALTER COLUMN id RESTART WITH 13;

---------------------------
-- Primary snippets
---------------------------

UPDATE sv."taskLanguage" SET "primarySnippetId" = 1	WHERE id = 1;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 2	WHERE id = 2;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 3	WHERE id = 3;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 4	WHERE id = 4;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 5	WHERE id = 5;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 6	WHERE id = 6;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 7	WHERE id = 7;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 8	WHERE id = 8;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 9	WHERE id = 9;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 10 WHERE id = 10;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 11 WHERE id = 11;
UPDATE sv."taskLanguage" SET "primarySnippetId" = 12 WHERE id = 12;
