{ # try

    echo '111' && echo '222' && git push
    #save your output

} || { # catch
    echo "aaa"
    # save log for exception
}