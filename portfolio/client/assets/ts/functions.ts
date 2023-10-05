function userRoles(roles: number[] | undefined, id?: string): void {
    if (roles == undefined) return;
    if (!id) {
        const userRolesDiv = document.getElementsByClassName('username-roles');
        for (let i = 0; i < userRolesDiv.length; i++) {
            const div = userRolesDiv[i] as HTMLElement;
            for (let j = 0; j < roles.length; j++) {
                if (roles[j] == 1) div.innerHTML += '<i class="fas fa-check-circle" data-title="V.I.P."></i>';
                if (roles[j] == 2) div.innerHTML += '<i class="fas fa-user-shield" data-title="Moderátor"></i>';
                if (roles[j] == 3) div.innerHTML += '<i class="fas fa-hammer" data-title="Adminisztátor"></i>';
                if (roles[j] == 4) div.innerHTML += '<i class="fas fa-pencil-paintbrush" data-title="Dizájner"></i>';
                if (roles[j] == 5) div.innerHTML += '<i class="fas fa-code" data-title="Fejlesztő"></i>';
                if (roles[j] == 6) div.innerHTML += '<i class="fas fa-crown" data-title="Tulajdonos"></i>';
            }
        }
    } else if (id) {
      const userRolesDiv = document.getElementsByClassName('username-roles-custom ' + id)[0] as HTMLElement;
      for(let i = 0; i < roles.length; i++) {
            if (roles[i] == 1) userRolesDiv.innerHTML += '<i class="fas fa-check-circle" data-title="V.I.P."></i>';
            if (roles[i] == 2) userRolesDiv.innerHTML += '<i class="fas fa-user-shield" data-title="Moderátor"></i>';
            if (roles[i] == 3) userRolesDiv.innerHTML += '<i class="fas fa-hammer" data-title="Adminisztátor"></i>';
            if (roles[i] == 4) userRolesDiv.innerHTML += '<i class="fas fa-pencil-paintbrush" data-title="Dizájner"></i>';
            if (roles[i] == 5) userRolesDiv.innerHTML += '<i class="fas fa-code" data-title="Fejlesztő"></i>';
            if (roles[i] == 6) userRolesDiv.innerHTML += '<i class="fas fa-crown" data-title="Tulajdonos"></i>';
        }
    }
}

function formatDate(ipDate: string): string {
    const date = new Date(ipDate);
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
    userRoles,
    formatDate,
    getFileType,
    getDomain,
    setCookie,
    getCookie,
    deleteCookie
};