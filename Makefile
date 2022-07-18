build_cv:
	- mkdir -p ./build
	- lualatex --interaction=nonstopmode --halt-on-error --output-directory=./build NicolasGuilloux_CV.tex