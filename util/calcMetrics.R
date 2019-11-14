# This document is to be used as a placeholder for two main functionalities of the repository
# 1) Data validation
# 2) Generating the metric file

# All script is writen in R which can be downloaded here:https://cran.r-project.org/
# R is not unlike python but has a slightly different grammar and syntax

# As for other languages R has a large collection of packages with specific functionality
# These packages often rely on previously existing packages (dependencies)

# The functions that will be most useful to us are found in the package 'pavo'
# pavo does have dependencies so these need to be loaded as well
# if pavo is installed in R, the dependencies are automatically installed as well

# Another package that may be very useful is in development. It is called lightR
# It's main function is to parse proprietary spectral file formats. These functions 
# would be used to extract values from the raw files to then calculate metrics
# This package is not yet available on CRAN so you need to follow the instruction
# provided here: https://github.com/Bisaloo/lightr to install this package.

# Arguments which coming from nodeJS
attach(input[[1]])

# In R, first install 'pavo' and its dependencies

install.packages('pavo')

# once installed packages need to be called before being used in the console

library(pavo)

# the following script has been written to process the 25 raw files I sent you

# set the proper working directory with 'setwd'
setwd(rawFilePath)

# getspec is a function that extracts the xy data from the raw files
# in this case I am assiging the resulting series of 25 sets of y-values to an object 
# for further manipulation

spectra <- getspec(ext = 'Master.Transmission')

# the object has dimensions 401 observations of 26 variables
# the 26 are one X, and 25 y sets becasue they all share the x-values
# this format is not great for storing data but makes ploting easier in pavo
# the 401 observation comes from data at each nanometer between 300 and 700 nm

# Any error message here (one file formats has been properly addressed) could indicate 
# a corrupted file

# As a first test of whether large negative values are found in the dataset
min(spectra) # in this case the value is positive (~0.8). Anything below ~ -2 (for percentage)
             # or -0.02 (proportion) could be flagged

# To calculate metrics we first need to clean the noise out and remove negative values 
# if there were found. The following line is generic enough to accomodate almost all datasets
# the fixneg argument removes the negative values by adding the largest minimum value to the 
# rest of the spectra. The opt argument states that we want to smooth the curves
# using a LOESS span of o.1

spectra <- procspec(spectra, fixneg = 'addmin', opt = 'smooth', span = 0.1)

# From these cleaned curves we can calculate 23 metrics which I will call objective metrics
# This will generate the metrics values I supplied to you in the file

objective_metrics <- summary(spectra)

# For more complicated metrics, we have to play with a few more functions which I will 
# not explain, but give 2 examples

# For generating colourspace coordinates in the human visual system

spectra_human <- vismodel(spectra, visual = 'cie10', vonkries = T, relative = F)
human_xy <- colspace(spectra_human, space = 'ciexyz')[,c('x','y')]

# For a generic bird visual system that is sensitive to UV

spectra_UVbird <- vismodel(spectra, visual = 'avg.uv')
UVbird_xyz <- colspace(spectra_UVbird)[,c('x','y','z')]

# This sums it up... As mentionned, this is a placeholder for now

return(objective_metrics)
