function renderUserRoles(user: any, username?: string): string {
    let html = '';
    for (let i = 0; i < user.profile.roles.length; i++) {
        switch (user.profile.roles[i]) {
            case 'vip':
                html += '<i class="fas fa-check-circle" data-title="V.I.P."></i>';
                break;
            case 'mod':
                html += '<i class="fas fa-user-shield" data-title="Moderátor"></i>';
                break;
            case 'admin':
                html += '<i class="fas fa-hammer" data-title="Adminisztátor"></i>';
                break;
            case 'designer':
                html += '<i class="fas fa-pencil-paintbrush" data-title="Dizájner"></i>';
                break;
            case 'developer':
                html += '<i class="fas fa-code" data-title="Fejlesztő"></i>';
                break;
            case 'owner':
                html += '<i class="fas fa-crown" data-title="Tulajdonos"></i>';
                break;
        }
    }
    const returnHtml = username ? html + username : html + user.profile.username;
    return returnHtml;
}


function formatDate(rdate: string): string {
    const date = new Date(rdate);
    function addZero(i: number): string {
        return i < 10 ? `0${i}` : i.toString();
    }
    const text = `${date.getFullYear()}.${addZero(date.getMonth() + 1)}.${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
    return text;
}

function getFileType(link: string) {
    const extension = link.split('.').pop() as string;

    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'apng', 'tiff', 'bmp'];
    const videoExtensions = ['mp4', 'mpeg', 'avi', 'webm', 'quicktime', 'x-matroska', 'x-flv', 'x-msvideo', 'x-ms-wmv'];

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    } else {
        return 'unknown';
    }
}

function getDomain() {
    const url = new URL(useRequestURL().href);
    const parts = url.hostname.split('.');
    return parts.slice(-2).join('.');
}

function setCookie(cName: string, cValue: string, expDays?: number): string {
    let date = new Date();
    date.setTime(date.getTime() + expDays! * 24 * 60 * 60 * 1000);
    if(expDays) {
        return useCookie(cName, { path: '/', domain: getDomain(), expires: date }).value = cValue;
    } else {
        return useCookie(cName, { path: '/', domain: getDomain() }).value = cValue;
    }
}

function getCookie(cName: string): string | null | undefined {
    return useCookie(cName).value;
}

function deleteCookie(cName: string): string {
    return useCookie(cName, { path: '/', domain: getDomain(), expires: new Date('thu, 01 jan 1970 00:00:01 GMT') }).value = '';
}

export default {
    renderUserRoles,
    formatDate,
    getFileType,
    getDomain,
    setCookie,
    getCookie,
    deleteCookie
}