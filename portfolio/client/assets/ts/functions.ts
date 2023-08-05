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
        if (i < 10) {
            i = Number('0' + i);
        }
        return i.toString();
    }
    const text = `${date.getFullYear()}.${addZero(date.getMonth() + 1)}.${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
    return text;
}

function getDomain() {
    const domain = `http://${location.hostname.split('.').slice(-2).join('.')}`;
    return domain;
}

function setCookie(cName: string, cValue: string, expDays?: number): void {
    let date = new Date();
    date.setTime(date.getTime() + expDays! * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = cName + '=' + cValue + '; ' + expires + `; path=/; domain=${useRuntimeConfig().public.cookieDomain}`;
}

function getCookie(cName: string): string | undefined {
    const name = cName + '=';
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split('; ');
    let res: string | undefined;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
}

function deleteCookie(cName: string): void {
    document.cookie = cName + `=; path=/; expires=thu, 01 jan 1970 00:00:01 GMT; domain=${useRuntimeConfig().public.cookieDomain}`;
}

export default {
    userRoles,
    formatDate,
    getDomain,
    setCookie,
    getCookie,
    deleteCookie
};