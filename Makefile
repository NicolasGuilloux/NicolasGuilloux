build_cv:
	- mkdir -p ./build
	- export SOURCE_DATE_EPOCH=$(date -d "2021-11-30" +%s)
	- lualatex --interaction=nonstopmode --output-directory=./build NicolasGuilloux_CV.tex