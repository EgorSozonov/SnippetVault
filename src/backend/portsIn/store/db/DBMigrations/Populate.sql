
---------------------------
-- Language groups
---------------------------
INSERT INTO sv."languageGroup"(id, code, name, "sortingOrder")	
OVERRIDING SYSTEM VALUE	VALUES (1, 'UNIVERSAL', 'General-purpose languages', 1)
ON CONFLICT (id) DO UPDATE SET code='UNIVERSAL', name='General-purpose languages', "sortingOrder" = 1;

INSERT INTO sv."languageGroup"(id, code, name, "sortingOrder")	
OVERRIDING SYSTEM VALUE	VALUES (2, 'SCRIPTING', 'Scripting languages', 1)
ON CONFLICT (id) DO UPDATE SET code='SCRIPTING', name='Scripting languages', "sortingOrder" = 2;

INSERT INTO sv."languageGroup"(id, code, name, "sortingOrder")	
OVERRIDING SYSTEM VALUE	VALUES (3, 'QUERY', 'Data query languages', 1)
ON CONFLICT (id) DO UPDATE SET code='QUERY', name='Data query languages', "sortingOrder" = 3;


---------------------------
-- Languages
---------------------------
INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (1, 'CS', 'C#', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='CS', name='C#', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (2, 'Java', 'Java', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='Java', name='Java', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (3, 'Rust', 'Rust', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='Rust', name='Rust', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (4, 'Cpp', 'C++', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='Cpp', name='C++', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (5, 'Pyth', 'Python', 0::bit, 2)
ON CONFLICT (id) DO UPDATE SET code='Pyth', name='Python', "isDeleted" = 0::bit, "languageGroupId" = 2;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (6, 'TySc', 'Typescript', 0::bit, 2)
ON CONFLICT (id) DO UPDATE SET code='TySc', name='Typescript', "isDeleted" = 0::bit, "languageGroupId" = 2;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (7, 'SQL1', 'MySQL', 0::bit, 3)
ON CONFLICT (id) DO UPDATE SET code='SQL1', name='MySQL', "isDeleted" = 0::bit, "languageGroupId" = 3;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (8, 'SQL2', 'T-SQL', 0::bit, 3)
ON CONFLICT (id) DO UPDATE SET code='SQL2', name='T-SQL', "isDeleted" = 0::bit, "languageGroupId" = 3;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (9, 'SQL3', 'PostgreSQL', 0::bit, 3)
ON CONFLICT (id) DO UPDATE SET code='SQL3', name='PostgreSQL', "isDeleted" = 0::bit, "languageGroupId" = 3;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (10, 'Dart', 'Dart', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='Dart', name='Dart', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (11, 'Kotl', 'Kotlin', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='Kotl', name='Kotlin', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (12, 'Swif', 'Swift', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='Swif', name='Swift', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (13, 'Hask', 'Haskell', 0::bit, 1)
ON CONFLICT (id) DO UPDATE SET code='Hask', name='Haskell', "isDeleted" = 0::bit, "languageGroupId" = 1;

INSERT INTO sv.language(id, code, name, "isDeleted", "languageGroupId")
OVERRIDING SYSTEM VALUE	VALUES (14, 'Lua', 'Lua', 0::bit, 2)
ON CONFLICT (id) DO UPDATE SET code='Lua', name='Lua', "isDeleted" = 0::bit, "languageGroupId" = 2;


---------------------------
-- Task groups
---------------------------

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (1, 'SYNTAX', 'Basic syntax', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='SYNTAX', name='Basic syntax', "isDeleted" = 0::bit;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (2, 'MATH', 'Math & arithmetic', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='MATH', name='Math & arithmetic', "isDeleted" = 0::bit;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (3, 'STRINGS', 'Strings', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='Strings', name='Strings', "isDeleted" = 0::bit;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (4, 'IO', 'Basic input & output', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='IO', name='Basic input & output', "isDeleted" = 0::bit;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (5, 'FILES', 'File system', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='FILES', name='File system', "isDeleted" = 0::bit;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (6, 'SORTING', 'Sorting algorithms', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='SORTING', name='Sorting algorithms', "isDeleted" = 0::bit;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (7, 'TREES', 'Tree algorithms', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='TREES', name='Tree algorithms', "isDeleted" = 0::bit;

INSERT INTO sv."taskGroup"(id, code, name, "isDeleted")
OVERRIDING SYSTEM VALUE	VALUES (8, 'GRAPH', 'Graph algorithms', 0::bit)
ON CONFLICT (id) DO UPDATE SET code='GRAPH', name='Graph algorithms', "isDeleted" = 0::bit;

---------------------------
-- Tasks
---------------------------

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (1, 'Immutable variable definition', 'Declare + define an immutable local variable', 1)
ON CONFLICT (id) DO UPDATE SET name='Immutable variable definition', description = '', "taskGroupId" = 1;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (2, 'Mutable variable definition', 'Declare + define a mutable local variable', 1)
ON CONFLICT (id) DO UPDATE SET name='SORTING', description = 'Declare + define an immutable local variable', "taskGroupId" = 1;

INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (3, 'Mutable variable assignment', 'Re-assign a value to a mutable local variable', 1)
ON CONFLICT (id) DO UPDATE SET name = 'Mutable variable assignment', description = 'Re-assign a value to a mutable local variable', "taskGroupId" = 1;


INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (4, 'If-else expression', 'A conditional expression with an if, else-if, and else blocks', 1)
ON CONFLICT (id) DO UPDATE SET name = 'If-else expression', description = 'A conditional expression with an if, else-if, and else blocks', "taskGroupId" = 1;


INSERT INTO sv.task(id, name, description, "taskGroupId")
OVERRIDING SYSTEM VALUE	VALUES (5, 'Square root', 'Calculation of a square root respectively for an integer and for a floating-point number', 2)
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